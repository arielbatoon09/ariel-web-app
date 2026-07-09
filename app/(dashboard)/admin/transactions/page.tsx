import { TransactionHeader } from "@/components/features/dashboard/transactions/transaction-header";
import { TransactionTable } from "@/components/features/dashboard/transactions/transaction-table";

export const metadata = {
  title: "Transactions Audit | Admin",
  description: "Verify reference codes and transaction logs from manual payment submissions.",
};

export default function AdminTransactionsPage() {
  return (
    <div className="space-y-6">
      <TransactionHeader />
      <TransactionTable />
    </div>
  );
}
