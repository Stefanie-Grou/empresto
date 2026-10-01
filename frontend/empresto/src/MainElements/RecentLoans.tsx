import { MOCK_LOANS } from "../mocks/mock_loans";
import type { LoanItem } from "./LoanItem";

interface RecentLoansProps {
    loans?: LoanItem[];
}

export default function RecentLoans({ loans = MOCK_LOANS }: RecentLoansProps) {
    return (
        <div className="bg-white-background border border-100-gray rounded-2xl p-6 shadow-sm w-full">
            <h2 className="div-title">
                Empréstimos recentes
            </h2>

            <div className="font-jakarta">
                <table className="w-full text-left text-sm font-sans">
                    <thead>
                        <tr className="text-xs uppercase font-semibold text-secondary-light-gray border-b border-gray-100">
                            <th className="pb-3 font-medium">LIVRO</th>
                            <th className="pb-3 font-medium">NOME</th>
                            <th className="pb-3 font-medium">TURMA</th>
                            <th className="pb-3 font-medium">TIPO</th>
                            <th className="pb-3 font-medium">PRAZO</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-100-gray">
                        {loans.map((loan) => (
                            <tr key={loan.id}>
                                <td className="py-3.5 pr-4">
                                    <div className="flex items-center gap-3">
                                        {loan.coverUrl ? (
                                            <img
                                                src={loan.coverUrl}
                                                alt={loan.bookTitle}
                                                className="w-10 h-12 rounded"
                                            />
                                        ) : (
                                            <div className="w-10 h-12" />
                                        )}
                                        <div className="flex flex-col">
                                            <span className="font-bold text-medium-gray">
                                                {loan.bookTitle}
                                            </span>
                                            <span className="text-xs text-secondary-light-gray">
                                                {loan.bookAuthor}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td className="py-3.5 px-2 text-medium-gray font-medium">
                                    {loan.userName}
                                </td>

                                <td className="py-3.5 px-2 text-medium-gray">
                                    {loan.classGroup || '-'}
                                </td>

                                <td className="py-3.5 px-2 text-medium-gray">
                                    {loan.userType}
                                </td>

                                <td className="py-3.5 pl-2 text-medium-gray font-medium">
                                    {loan.dueDate}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}