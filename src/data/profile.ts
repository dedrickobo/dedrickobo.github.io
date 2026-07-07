export const profile = {
  name: "Dedrick D.",
  roleTitle: "DevOps Engineer",
  roleAt: "Apple DevOps Institute",
  headline:
    "DevOps Engineer @ Apple DevOps Institute · AWS Solutions Architect · RHCSA · CCNA",
  tagline:
    "Building reliable, scalable, and efficient systems through automation and modern deployment practices.",
  location: "Batam, Riau Islands, Indonesia",
  timezone: "UTC+7",
  availability: "Open to DevOps / Cloud / SRE roles",
  email: "dedrickirl@gmail.com",
  linkedin: "https://www.linkedin.com/in/dedrickk/",
  github: "https://github.com/dedrickk",
  summary: `A results-driven DevOps engineer with a passion for automation, cloud infrastructure, and modern deployment practices. I specialize in solving complex problems across cloud computing, containerization, CI/CD pipelines, and system observability, building reliable and efficient systems and treating the work itself as the proof.`,
};

export const experiences = [
  {
    title: "DevOps Engineer",
    company: "Apple DevOps Institute",
    period: "2026 – Present",
    location: "Batam, Indonesia",
    description: [
      "Built aform, a full DevOps platform for a Go SaaS across dev, staging, and prod on AWS, with CI/CD, three-signal observability, and an AI-enriched alerting relay.",
      "Engineered procal-infra, multi-environment AWS Infrastructure-as-Code in Terraform with OIDC-based CI/CD, mocked unit tests, and cost and security gates.",
      "Practised production DevOps end to end: structured observability, immutable deploys, IAM least privilege, and policy as code.",
    ],
    current: true,
  },
  {
    title: "DevOps Consultant",
    company: "OneByOne",
    period: "Current",
    location: "Indonesia",
    description: [
      "Advising on cloud infrastructure and deployment pipelines.",
      "Implementing CI/CD practices for development teams.",
      "Automating infrastructure provisioning and configuration.",
    ],
    current: true,
  },
  {
    title: "Infrastructure Engineer (Intern)",
    company: "PT Pundi Mas Berjaya",
    period: "Sep 2023 – Feb 2024",
    location: "Indonesia",
    description: [
      "Orchestrated Zabbix deployment for server monitoring with Discord alert integration.",
      "Analyzed Uptime Institute Tier IV standards for a new data center project.",
      "Executed Plesk migration to a fresh server with minimal downtime.",
    ],
    current: false,
  },
  {
    title: "System Administrator (Intern)",
    company: "Infinite Learning Indonesia",
    period: "Aug 2023 – Dec 2023",
    location: "Indonesia",
    description: [
      "Developed and integrated IBM Security Verify using Node.js.",
      "Underwent comprehensive training in Red Hat Enterprise Linux (RHEL) administration.",
    ],
    current: false,
  },
  {
    title: "Solutions Architect (Intern)",
    company: "Elitery",
    period: "Nov 2022 – Dec 2022",
    location: "Indonesia",
    description: [
      "Gathered client requirements and proposed tailored IT solutions.",
      "Designed cloud architectures based on the AWS Well-Architected Framework.",
    ],
    current: false,
  },
];

// Featured case studies lead; secondary work follows. All identifiers sanitized:
// no real account IDs, IPs, internal hostnames, webhook URLs, or org names.
export const projects = [
  {
    slug: "aform",
    title: "aform",
    kind: "DevOps Platform",
    featured: true,
    period: "2026",
    role: "DevOps / Platform Engineer",
    diagram: "aform" as const,
    summary:
      "End-to-end DevOps platform for a Go form-builder SaaS across dev, staging, and production on AWS. It pairs continuous delivery with full three-signal observability and a custom, AI-enriched alerting pipeline.",
    highlights: [
      "Custom alert pipeline: Grafana Cloud rules fire to a self-built Python relay that reshapes them into Discord embeds, with per-alert cooldown to stop alert storms.",
      "AI-enriched alerting: on a background thread the relay calls AWS Bedrock (Claude Haiku), pulling recent Loki logs and Mimir metrics to post a follow-up hypothesis of what likely happened and what to try next.",
      "Two-phase delivery with graceful degradation: the primary Discord alert is always synchronous, so if Bedrock is throttled or unreachable only the AI enrichment is skipped.",
      "Three-signal observability: Prometheus metrics, Loki logs, and Tempo traces ship through a Grafana Alloy agent to Grafana Cloud, with slog logging correlated to OpenTelemetry trace IDs.",
      "An aform-ops MCP server exposes 11 operational tools (Loki, Mimir, Tempo, alert silencing, EC2 health, recent deploys) so Claude can query the live stack over an SSH tunnel.",
      "Immutable artifact promotion: built once per commit SHA into S3, then promoted dev to staging to prod behind a manual production gate, with one-command rollback.",
      "CI quality gates: golangci-lint, unit and integration tests, gosec, govulncheck, SonarQube, and secret scanning, plus a Cerebras AI test-gap detector that opens fix PRs.",
    ],
    stack: [
      "Go",
      "AWS EC2",
      "AWS Bedrock",
      "Grafana Cloud",
      "Loki",
      "Mimir",
      "Tempo",
      "OpenTelemetry",
      "RabbitMQ",
      "PostgreSQL",
      "Bitbucket Pipelines",
      "MCP",
    ],
  },
  {
    slug: "procal-infra",
    title: "procal-infra",
    kind: "Cloud Platform · IaC",
    featured: true,
    period: "2026",
    role: "Infrastructure Engineer",
    diagram: "procal" as const,
    summary:
      "Infrastructure-as-Code for a multi-environment AWS platform running three microservices. A self-owned VPC, autoscaling compute, managed databases, an event-driven worker tier, and a zero-credential CI/CD pipeline, all in Terraform.",
    highlights: [
      "Self-owned AWS VPC with per-environment isolation: a VPN-locked single-AZ staging tier and a multi-AZ production tier behind public and internal load balancers.",
      "Zero long-lived credentials: pipelines assume per-app deploy roles via OIDC, scoped by workspace and repository.",
      "Every IAM role carries a mandatory permissions boundary and attaches only customer-managed policies, enforcing least privilege even against an over-broad policy.",
      "Native terraform test mocked unit suites assert subnet CIDRs, routing, security-group rules, and state-bucket hardening with no AWS access.",
      "Three isolated remote-state backends with a shared-outputs contract, so compute, data, and events can be built and applied independently.",
      "Event-driven worker tier: SNS domain events fan out to an SQS queue with a dead-letter queue, triggering a Go Lambda for asynchronous email.",
      "Production hardening: multi-AZ RDS with a managed master password and deletion protection, target-tracking autoscaling, and TLS 1.3 at the edge.",
      "Cost and security gates in CI: an Infracost threshold, Trivy secret and misconfig scanning, and tflint on every pull request.",
    ],
    stack: [
      "Terraform",
      "AWS",
      "VPC",
      "Auto Scaling",
      "RDS",
      "SNS / SQS",
      "Lambda",
      "OIDC",
      "Infracost",
      "Trivy",
      "tflint",
    ],
  },
  {
    slug: "observability-stack",
    title: "Observability & Alerting Stack",
    kind: "Monitoring",
    featured: false,
    period: "2023 – 2024",
    role: "Infrastructure Engineer",
    diagram: null,
    summary:
      "Server monitoring and on-call alerting built on Zabbix and Grafana, with Discord integration delivering real-time alerts to the team.",
    highlights: [],
    stack: ["Zabbix", "Grafana", "Discord", "Linux"],
  },
  {
    slug: "devops-template",
    title: "DevOps Infrastructure Template",
    kind: "Tooling",
    featured: false,
    period: "2025",
    role: "Author",
    diagram: null,
    summary:
      "A production-ready infrastructure template that streamlines DevOps workflows: Docker Compose services behind a reverse proxy, a monitoring stack, and AI integration baked in.",
    highlights: [],
    stack: ["Docker", "Traefik", "Prometheus", "AI Integration"],
  },
  {
    slug: "kopitiam-dewi",
    title: "Kopitiam Dewi",
    kind: "Mobile App",
    featured: false,
    period: "2023",
    role: "Developer",
    diagram: null,
    summary:
      "A mobile ordering and cashless payment system for a coffee shop, with product menus, order management, and secure payment processing.",
    highlights: [],
    stack: ["Kotlin", "Android", "Firebase"],
  },
];

export const skills = {
  "Cloud Providers": ["AWS", "Microsoft Azure", "Google Cloud", "Digital Ocean"],
  "CI/CD & Version Control": ["Jenkins", "Git", "Azure DevOps", "GitHub Actions"],
  "Containers & Orchestration": ["Docker", "Docker Compose", "Podman", "Container Registry"],
  "Infrastructure as Code": ["Terraform", "Ansible", "CloudFormation"],
  "Monitoring & Observability": ["Grafana", "Prometheus", "Loki", "Tempo", "Zabbix", "Elastic (ELK)"],
  "Systems & OS": ["Linux", "Red Hat (RHEL)", "Ubuntu", "macOS"],
  "Networking": ["Cisco (CCNA)", "MikroTik (MTCNA)", "OpenVPN", "Tailscale", "BIND DNS", "Pi-hole"],
  "Tools & Platforms": ["Proxmox", "Microsoft 365", "Microsoft Intune"],
};

export const certifications = [
  { name: "Microsoft Certified: Azure Fundamentals", issuer: "Microsoft", date: "Jun 2025", badge: "azure" },
  { name: "Red Hat Certified System Administrator (RHCSA)", issuer: "Red Hat", date: "Dec 2023 – Dec 2026", badge: "redhat" },
  { name: "Cisco Certified Network Associate (CCNA)", issuer: "Cisco", date: "May 2023 – May 2026", badge: "cisco" },
  { name: "MikroTik Certified Network Associate (MTCNA)", issuer: "MikroTik", date: "Feb 2023 – Feb 2026", badge: "mikrotik" },
  { name: "AWS Solutions Architect – Associate", issuer: "Amazon Web Services", date: "Nov 2022 – Nov 2025", badge: "aws" },
  { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", date: "Sep 2022 – Sep 2025", badge: "aws" },
];

export const education = {
  institution: "Universitas Internasional Batam",
  degree: "Bachelor of Computer Science (S.Kom)",
  field: "Information Technology",
  period: "2021 – 2025",
  gpa: "3.91",
};

export const awards = [
  { title: "Runner-up, Kompetisi STEM 2022", issuer: "TechReady & Red Hat", date: "Sep 2022" },
];

export const languages = [
  { name: "English", proficiency: "Native or bilingual proficiency" },
  { name: "Indonesian", proficiency: "Native or bilingual proficiency" },
];
