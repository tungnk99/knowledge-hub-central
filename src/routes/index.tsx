import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import playbookHtml from "../../ai-agent-consulting-playbook_r4.html?raw";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Agent Consulting Playbook" },
      { name: "description", content: "AI Agent Presales & Consulting Playbook." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <AppLayout>
      <PlaybookHomePage />
    </AppLayout>
  );
}

function PlaybookHomePage() {
  return (
    <iframe
      title="AI Agent Consulting Playbook r4"
      srcDoc={playbookHtml}
      sandbox="allow-scripts allow-same-origin"
      className="block h-[calc(100vh-0px)] min-h-screen w-full border-0 bg-white"
    />
  );
}
