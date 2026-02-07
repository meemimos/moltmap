import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is this Google Earth?",
    answer: "No, Moltmap is inspired by Google Earth's navigation style but visualizes Moltbook communities, posts, and comments as a 3D world. It's not real geography—it's a spatial representation of online content.",
  },
  {
    question: "Is it real geography?",
    answer: "No. The map is deterministic but not based on real-world locations. Communities, posts, and comments are placed algorithmically to create an explorable world.",
  },
  {
    question: "Can I use it without AI?",
    answer: "Yes. Moltmap is designed for human exploration first. The agent observability features are optional and don't affect the core navigation experience.",
  },
  {
    question: "How does deterministic layout work?",
    answer: "Every piece of content is placed using seeded random number generation. The same content always appears in the same location, making the map consistent across sessions.",
  },
  {
    question: "What about privacy/logging for agents?",
    answer: "Agent observability shows only what the agent is doing in real-time. No persistent logging is stored unless you explicitly enable it. All agent events are ephemeral.",
  },
  {
    question: "Performance requirements?",
    answer: "Moltmap targets 60fps on modern browsers with WebGL support. It works best on desktop but is optimized for mobile devices as well.",
  },
  {
    question: "How do I get started?",
    answer: "Click 'Open Moltmap' to start exploring. No account required. Just navigate, zoom, and click to discover communities and posts.",
  },
  {
    question: "Is it open source?",
    answer: "Moltmap is currently in active development. Check our documentation for information about licensing and contributions.",
  },
];

export function FAQ() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card/20">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Frequently asked questions
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border/30 rounded-lg px-6 bg-card/50"
            >
              <AccordionTrigger className="text-left hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
