export default function UpcomingPage({ title }: { title: string }) {
    return (
        <main className="container mx-auto px-4 py-12">
            <div className="rounded-xl border border-[#e4d9ca] bg-white p-8 shadow-sm">
                <h1 className="font-serif text-3xl text-[#1a1a18]">{title}</h1>
                <p className="mt-4 text-gray-600">
                    This admin section is being built. Content management will be available here when its controller is added.
                </p>
            </div>
        </main>
    );
}
