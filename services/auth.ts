"use server";

import { getErrorMessage } from "@/lib/error-utils";
import { getCurrentSessionUser } from "@/data/auth";
import { getUserByAuthId, updateUserByAuthId } from "@/data/users";
import { getUserRoleByUserId } from "@/data/roles";
import { cookies } from "next/headers";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { r2Client } from "@/lib/r2/client";
import { buildR2ObjectKey, buildR2PublicUrl, getR2BucketName } from "@/lib/r2/paths";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { checkRateLimit } from "@/lib/rate-limit";

export async function checkLoginRateLimitAction(email: string) {
  try {
    const rateLimit = await checkRateLimit("rate_limit:login", 5, 60, email);
    if (!rateLimit.success) {
      return {
        success: false,
        error: `Too many login attempts. Please wait ${rateLimit.reset} seconds before trying again.`,
      };
    }
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Rate limit check failed.") };
  }
}

export async function getUserRoleAction() {
  try {
    const user = await getCurrentSessionUser();

    if (!user) {
      return { success: false, error: "Not logged in" };
    }

    const dbUser = await getUserByAuthId(user.id);

    if (!dbUser) {
      return { success: false, error: "User profile not found in database" };
    }

    const role = await getUserRoleByUserId(dbUser.id);

    if (!role) {
      return { success: true, role: "client" as const };
    }

    return { success: true, role };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to get user role") };
  }
}

export async function getCurrentUserProfileAction() {
  try {
    const user = await getCurrentSessionUser();

    if (!user) {
      return { success: false, error: "Not logged in" };
    }

    const dbUser = await getUserByAuthId(user.id);

    if (!dbUser) {
      return { success: false, error: "User profile not found in database" };
    }

    return {
      success: true,
      user: {
        id: dbUser.id,
        authId: dbUser.authId,
        fullName: dbUser.fullName,
        phone: dbUser.phone,
        email: user.email,
        avatarUrl: user.user_metadata?.avatar_url || null,
      },
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to get user profile") };
  }
}

export async function updateUserProfileAction(data: { fullName: string; phone?: string | null }) {
  try {
    const user = await getCurrentSessionUser();
    if (!user) {
      return { success: false, error: "Not logged in" };
    }

    const updated = await updateUserByAuthId(user.id, {
      fullName: data.fullName,
      phone: data.phone,
    });

    if (!updated) {
      return { success: false, error: "Profile not found or update failed" };
    }

    revalidatePath("/", "layout");

    return {
      success: true,
      user: {
        id: updated.id,
        fullName: updated.fullName,
        phone: updated.phone,
      },
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to update profile") };
  }
}

export async function updateUserPasswordAction(password: string) {
  try {
    const user = await getCurrentSessionUser();
    if (!user) {
      return { success: false, error: "Not logged in" };
    }

    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to update password") };
  }
}

export async function getAvatarPresignedUrlAction(filename: string, contentType: string) {
  try {
    const user = await getCurrentSessionUser();
    if (!user) {
      return { success: false, error: "Not logged in" };
    }

    if (!contentType.startsWith("image/")) {
      return { success: false, error: "Only image files are allowed as profile avatars." };
    }

    const bucketName = getR2BucketName();
    if (!bucketName) {
      return { success: false, error: "Cloudflare R2 Bucket Name is not configured." };
    }

    const cleanFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const key = buildR2ObjectKey("avatars", user.id, cleanFilename);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 600 });
    const cdnUrl = buildR2PublicUrl(key);

    return {
      success: true,
      presignedUrl,
      url: cdnUrl,
      key,
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to generate avatar upload link.") };
  }
}

export async function updateUserAvatarAction(avatarUrl: string) {
  try {
    const user = await getCurrentSessionUser();
    if (!user) {
      return { success: false, error: "Not logged in" };
    }

    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    const { error } = await supabase.auth.updateUser({
      data: { avatar_url: avatarUrl },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to update profile avatar.") };
  }
}
