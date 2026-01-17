"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Search, FileText, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [newDocTitle, setNewDocTitle] = useState("");
    const [newDocContent, setNewDocContent] = useState("");
    const [isDiaOpen, setIsDiaOpen] = useState(false);

    useEffect(() => {
        const fetchDocs = async () => {
            const { data, error } = await supabase
                .from("documents")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error && data) {
                setDocuments(data);
            }
            setLoading(false);
        };

        fetchDocs();
    }, []);

    const handleCreateDocument = async () => {
        if (!newDocTitle) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data, error } = await supabase
                .from("documents")
                .insert([{ user_id: user.id, title: newDocTitle, content: newDocContent }])
                .select();

            if (!error && data) {
                setDocuments([data[0], ...documents]);
                setIsDiaOpen(false);
                setNewDocTitle("");
                setNewDocContent("");
            }
        }
    };

    const filteredDocs = documents.filter((doc) =>
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.content?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
                    <p className="text-muted-foreground">Manage and organize your knowledge base.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog open={isDiaOpen} onOpenChange={setIsDiaOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                <Plus className="mr-2 h-4 w-4" /> New Notes
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New Notes</DialogTitle>
                                <DialogDescription>Start writing...</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">Title</Label>
                                    <Input id="title" value={newDocTitle} onChange={(e) => setNewDocTitle(e.target.value)} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="content" className="text-right">Content</Label>
                                    <Textarea id="content" value={newDocContent} onChange={(e) => setNewDocContent(e.target.value)} className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateDocument}>Save</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search notes..."
                    className="pl-8 max-w-sm bg-background"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredDocs.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredDocs.map((doc) => (
                        <Card key={doc.id} className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    {doc.title}
                                </CardTitle>
                                <CardDescription>Created {new Date(doc.created_at).toLocaleDateString()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="line-clamp-4 text-sm text-muted-foreground">
                                    {doc.content || "No content."}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-muted-foreground">
                    No notes found.
                </div>
            )}
        </div>
    );
}
