import branches from "../assets/branches-versions.png";
import gitPublishing from "../assets/git-publishing.png";
import { ModernInterface } from "./modern-interface";

export const features = [
  {
    header: (
      <>
        <span className="text-primary">Agent</span>-Ready
      </>
    ),
    title: "Agent-ready",
    description:
      "Let users' AI agents query your documentation. Built-in MCP servers alongside llms.txt files allow LLMs to ingest your product context instantly.",
    video: "/_docs.page/agent-ready.mp4",
    link: "/agent-access",
  },
  {
    header: (
      <>
        <span className="text-primary">Git</span> Publishing
      </>
    ),
    title: "Git publishing",
    description:
      "Deploy updates directly from your public GitHub repository. Eliminate build pipelines, hosting configuration, or infrastructure maintenance.",
    image: gitPublishing,
    link: "/git-publishing",
  },
  {
    header: (
      <>
        <span className="text-primary">Intelligent</span> Search
      </>
    ),
    title: "Intelligent search",
    description:
      "Index content automatically and provide an embedded AI chat. Locate information instantly without third-party tracking scripts or external setup.",
    video: "/_docs.page/intelligent-search.mp4",
    link: "/intelligent-search",
  },
  {
    header: (
      <>
        <span className="text-primary">Markdown</span> Components
      </>
    ),
    title: "Markdown components",
    description:
      "Add interactive components to your docs with MDX for richer experiences than standard Markdown.",
    video: "/_docs.page/markdown-components.mp4",
    link: "/markdown-components",
  },
  {
    header: (
      <>
        <span className="text-primary">Branches</span> & versions
      </>
    ),
    title: "Branches & versions",
    description:
      "Serve any Git branch, tag, or release as a distinct documentation site. Seamlessly organise versions and live staging previews on the fly.",
    image: branches,
    link: "/agent-ready",
  },
  {
    header: (
      <>
        <span className="text-primary">Modern</span> Interface
      </>
    ),
    title: "Modern interface",
    description:
      "Style your docs site using shadcn/ui design standards. Customize components easily to match your brand identity.",
    component: <ModernInterface />,
    link: "/modern-interface",
  },
];
