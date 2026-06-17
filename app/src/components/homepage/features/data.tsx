import branches from "../assets/branches-versions.png";
import gitPublishing from "../assets/git-publishing.png";
import { ModernInterface } from "./modern-interface";

export const features = [
  {
    titleText: "Agent-ready",
    title: (
      <>
        <span className="text-primary font-light">Agent</span>-ready
      </>
    ),
    description:
      "Let users' AI agents query your documentation. Built-in MCP servers alongside llms.txt files allow LLMs to ingest your product context instantly.",
    video: "/_docs.page/agent-ready.mp4",
    link: "/agent-access",
  },
  {
    titleText: "Git Publishing",
    title: (
      <>
        <span className="text-primary font-light">Git</span> Publishing
      </>
    ),
    description:
      "Deploy updates directly from your public GitHub repository. Eliminate build pipelines, hosting configuration, or infrastructure maintenance.",
    image: gitPublishing,
    link: "/git-publishing",
  },
  {
    titleText: "Intelligent Search",
    title: (
      <>
        <span className="text-primary font-light">Intelligent</span> Search
      </>
    ),
    description:
      "Index content automatically and provide an embedded AI chat. Locate information instantly without third-party tracking scripts or external setup.",
    video: "/_docs.page/intelligent-search.mp4",
    link: "/intelligent-search",
  },
  {
    titleText: "Markdown Components",
    title: (
      <>
        <span className="text-primary font-light">Markdown</span> Components
      </>
    ),
    description:
      "Add interactive components to your docs with MDX for richer experiences than standard Markdown.",
    video: "/_docs.page/markdown-components.mp4",
    link: "/markdown-components?v=2",
  },
  {
    titleText: "Branches & versions",
    title: (
      <>
        <span className="text-primary font-light">Branches</span> & versions
      </>
    ),
    description:
      "Serve any Git branch, tag, or release as a distinct documentation site. Seamlessly organise versions and live staging previews on the fly.",
    image: branches,
    link: "/agent-ready",
  },
  {
    titleText: "Modern Interface",
    title: (
      <>
        <span className="text-primary font-light">Modern</span> Interface
      </>
    ),
    description:
      "Style your docs site using shadcn/ui design standards. Customize components easily to match your brand identity.",
    component: <ModernInterface />,
    link: "/modern-interface",
  },
];
