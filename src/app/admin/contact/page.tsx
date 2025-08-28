"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

type Contact = {
	id: string;
	name: string;
	email: string | null;
	phone: string;
	description: string;
	is_check: boolean;
	created_at?: unknown;
	updated_at?: unknown;
};

type GetContactsResponse = {
	success: boolean;
	data: Contact[];
	nextCursor?: string | null;
	hasNextPage?: boolean;
	count?: number;
};

type UpdateResponse = {
	success: boolean;
	data: Contact;
	message?: string;
};

export default function AdminContactPage() {
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [updatingId, setUpdatingId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<"new" | "done">("new");

	const fetchContacts = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await fetch("/api/contact?limit=100&sort=DESC", { cache: "no-store" });
			if (!res.ok) {
				const e = await res.json().catch(() => ({}));
				throw new Error(e?.message || `HTTP ${res.status}`);
			}
			const json: GetContactsResponse = await res.json();
			setContacts(Array.isArray(json.data) ? json.data : []);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchContacts();
	}, [fetchContacts]);

	const unchecked = useMemo(() => contacts.filter((c) => !c.is_check), [contacts]);
	const checked = useMemo(() => contacts.filter((c) => c.is_check), [contacts]);

	const toggleCheck = useCallback(
		async (contact: Contact) => {
			try {
				setUpdatingId(contact.id);
				setError(null);

				const makeRequest = async () => {
					const res = await fetch(`/api/contact/${contact.id}`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ is_check: !contact.is_check }),
					});
					if (!res.ok) {
						const e = await res.json().catch(() => ({}));
						throw new Error(e?.message || `HTTP ${res.status}`);
					}
					const json: UpdateResponse = await res.json();
					return json.data as Contact;
				};

				const requestPromise = makeRequest();
				toast.promise(requestPromise, {
					loading: contact.is_check ? "Đang bỏ đánh dấu..." : "Đang đánh dấu đã liên hệ...",
					success: (data) => (data.is_check ? "Đã đánh dấu: Đã liên hệ" : "Đã bỏ đánh dấu: Khách hàng mới"),
					error: (err) => err.message || "Cập nhật thất bại",
				});

				const updated = await requestPromise;

				setContacts((prev) => prev.map((c) => (c.id === contact.id ? updated : c)));
			} catch (err) {
				setError((err as Error).message);
			} finally {
				setUpdatingId(null);
			}
		},
		[]
	);

	const List = ({ data }: { data: Contact[] }) => (
		<div className="space-y-3">
			{data.length === 0 && (
				<div className="text-sm text-gray-500">Không có dữ liệu</div>
			)}
			{data.map((c) => (
				<div key={c.id} className="border rounded p-3">
					<div className="flex items-center justify-between gap-3">
						<div className="flex items-center gap-3 min-w-0">
							<button
								title={c.is_check ? "Bỏ đánh dấu đã liên hệ" : "Đánh dấu đã liên hệ"}
								aria-label={c.is_check ? "Bỏ đánh dấu đã liên hệ" : "Đánh dấu đã liên hệ"}
								onClick={() => toggleCheck(c)}
								disabled={updatingId === c.id}
								className={`shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full border ${
									c.is_check
										? "bg-emerald-600 border-emerald-600 text-white"
										: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
								}`}
							>
								{updatingId === c.id ? (
									<svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M12 3a9 9 0 1 0 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
									</svg>
								) : c.is_check ? (
									<CheckCircle2 size={18} />
								) : (
									<Circle size={18} />
								)}
							</button>
							<div className="min-w-0">
								<div className="font-medium truncate">{c.name}</div>
								<div className="mt-1 text-sm text-gray-600 truncate">
									{c.email || "Không email"} · {c.phone}
								</div>
                                {c.description && (
                                    <p className="mt-2 text-sm whitespace-pre-wrap break-words">{c.description}</p>
                                )}
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);

	return (
		<div className="p-4 space-y-4">
			<Toaster position="bottom-right"/>
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-semibold">Liên hệ</h1>
				<button
					className="px-3 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
					onClick={fetchContacts}
					disabled={loading}
				>
					{loading ? "Đang tải..." : "Tải lại"}
				</button>
			</div>

			{error && (
				<div className="text-sm text-red-600">Lỗi: {error}</div>
			)}

			<Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "new" | "done")}> 
				<TabsList>
					<TabsTrigger value="new">Khách hàng mới ({unchecked.length})</TabsTrigger>
					<TabsTrigger value="done">Đã liên hệ ({checked.length})</TabsTrigger>
				</TabsList>
				<TabsContent value="new">
					<List data={unchecked} />
				</TabsContent>
				<TabsContent value="done">
					<List data={checked} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
