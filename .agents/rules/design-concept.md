# Project Design & Consistency Guide

This guide establishes the conventions for building and styling Modals, Dialogs, Inputs, and Buttons within this project to maintain a cohesive, minimalist tech/monospace aesthetic.

---

## 1. General Aesthetic Guidelines
- **Typography**: Primary layout labels, metadata, and buttons should use `font-mono text-xs` or `text-[10px]` with uppercase lettering and tracking (e.g. `tracking-widest`). Actual values or headings can use `font-sans`.
- **Borders**: Prefer sharp edges (`rounded-none`). Standard borders are `border-neutral-300` (light mode) and `border-neutral-700` (dark mode). Auxiliary elements may use `border-dashed`.
- **Focus States**: Inputs must animate their focus state from dashed to solid with a smooth transition:
  ```className
  "transition-all duration-200 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:focus-visible:border-neutral-100"
  ```

---

## 2. Add Modals (Creation Dialogs)
Used for creating or registering new entities.

- **Structure**:
  - **Container**: `DialogContent` with `rounded-none border border-neutral-300 bg-background/95 p-6 font-mono text-xs backdrop-blur-md dark:border-neutral-700`.
  - **Decorative Accents**: Absolute-positioned corner brackets at the edges of the card/modal content:
    ```tsx
    <div className="pointer-events-none absolute -top-px -left-px z-50 size-2.5 border-t-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
    <div className="pointer-events-none absolute -top-px -right-px z-50 size-2.5 border-t-2 border-r-2 border-neutral-400 dark:border-neutral-500" />
    <div className="pointer-events-none absolute -bottom-px -left-px z-50 size-2.5 border-b-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
    <div className="pointer-events-none absolute -right-px -bottom-px z-50 size-2.5 border-r-2 border-b-2 border-neutral-400 dark:border-neutral-500" />
    ```
  - **Header**: Main Title (`font-sans text-base font-bold`) and an uppercase description/subtitle (`text-neutral-450 text-[10px] uppercase`).
  - **Inputs**: Form inputs should have a height of `h-9`, use `border-dashed`, and feature the focus animation defined above.
  - **Buttons**: Footer buttons should be `h-8` with uppercase mono-text (`font-mono text-[10px]`). Secondary/Cancel buttons should be `border-dashed`.

---

## 3. Details Modals (Profile & Details Dialogs)
Used for viewing and editing existing resources.

- **Structure**:
  - **Wrapper**: Wrap using `ManagementDetailDialog` with appropriate `title` and `subtitle`.
  - **Grid Layout**: Fields should be organized in a grid layout:
    ```tsx
    <div className="grid grid-cols-3 gap-2">
      <span className="text-neutral-450 uppercase">Field Name:</span>
      <span className="col-span-2 font-sans font-bold text-foreground">Field Value</span>
    </div>
    ```
  - **Inline Editing Mode**:
    - Place an **"Edit details"** toggle button in the footer actions.
    - When `isEditing` is toggled:
      - Replace static details with inline `Input` components (`h-8` or `h-9` height, using standard dashed border and focus ring animation).
      - Set up auto-slug generation where appropriate (e.g. typing a Name automatically populates the Slug).
      - Replace the footer action with **"Save Changes"** (disabled if inputs are invalid or unchanged) and **"Cancel"**.

---

## 4. Auth & Full-Page Form Layouts
For standalone pages (like Login or Signup):

- **Card Styling**: Auth card container uses dashed borders with corner plus signs (`+`) as accents:
  ```tsx
  <div className="relative border border-dashed border-neutral-200 bg-white/85 p-8 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/60">
    <div className="pointer-events-none absolute -top-1.5 -left-1.5 z-10 bg-background px-0.5 text-[10px] text-neutral-400/80 dark:text-neutral-600/80">+</div>
    {/* ...other corners */}
  </div>
  ```
- **Input and Button Alignment**:
  - Inputs should be `h-9`.
  - Primary button height must be **consistent with the inputs** (`h-9` instead of smaller sizes like `h-8` used in dialog footers) to stand out as a primary page action.
  - Apply the standard focus animations to inputs.
