require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./models/Blog');

const sampleBlogs = [
    {
        title: 'What is RLHF and Why Does It Matter?',
        excerpt: 'Reinforcement Learning from Human Feedback (RLHF) is the secret sauce behind ChatGPT and other leading LLMs. Learn how human feedback shapes AI behavior.',
        content: `Reinforcement Learning from Human Feedback (RLHF) has emerged as one of the most critical techniques in modern AI development. It's the process that transformed GPT-3 into ChatGPT and made AI assistants significantly more helpful, harmless, and honest.

## How RLHF Works

RLHF involves three key steps:

1. **Supervised Fine-Tuning**: Training the model on high-quality human-written examples
2. **Reward Model Training**: Human annotators rank model outputs to train a reward model
3. **Reinforcement Learning**: The model is optimized using PPO (Proximal Policy Optimization) to maximize the reward

## Why It Matters

Before RLHF, language models were powerful but unpredictable. They could generate toxic content, provide unreliable information, or simply refuse to engage with user requests. RLHF aligns these models with human values and preferences.

## Real-World Impact

Companies like OpenAI, Anthropic, and Google have invested heavily in RLHF infrastructure. The quality of human feedback directly impacts model performance, making expert annotators essential to building safe, reliable AI systems.`,
        category: 'AI Training',
        author: {
            name: 'Dr. Sarah Chen',
            role: 'Lead AI Researcher',
            avatar: ''
        },
        featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
        readTime: '8 min read',
        published: true,
        tags: ['RLHF', 'AI Training', 'Machine Learning']
    },
    {
        title: 'The Art and Science of Data Labeling',
        excerpt: 'Quality data annotation requires more than just following guidelines. Discover the skills and expertise that separate good data from great data.',
        content: `Data labeling is often misunderstood as a simple, mechanical task. In reality, it's a sophisticated blend of domain expertise, attention to detail, and critical thinking.

## The Hidden Complexity

Consider annotating medical images. A quality annotator needs to:
- Understand medical terminology
- Recognize subtle visual patterns
- Apply consistent judgment across thousands of images
- Identify edge cases and ambiguous examples

## Quality Assurance is Critical

At Alanxa, we implement multiple layers of QA:
- Peer review by fellow annotators
- Expert review by domain specialists
- Automated consistency checks
- Regular calibration sessions

## The Human Element

AI can assist with pre-labeling and quality checks, but human judgment remains irreplaceable. Context, nuance, and ethical considerations require human intelligence.`,
        category: 'Data Annotation',
        author: {
            name: 'Michael Rodriguez',
            role: 'Head of Operations',
            avatar: ''
        },
        featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        readTime: '6 min read',
        published: true,
        tags: ['Data Annotation', 'Quality Assurance', 'Best Practices']
    },
    {
        title: 'Building Multilingual AI: More Than Translation',
        excerpt: 'Creating truly global AI requires understanding cultural context, idiomatic expressions, and regional variations across 50+ languages.',
        content: `As AI systems expand globally, multilingual capabilities are no longer optional—they're essential. But building multilingual AI involves far more than simple translation.

## Cultural Context Matters

A phrase that's polite in one culture might be offensive in another. Effective multilingual AI requires native speakers who understand:
- Cultural norms and taboos
- Regional dialects and variations
- Formality levels and social conventions
- Historical and political sensitivities

## The Challenge of Low-Resource Languages

While English, Spanish, and Chinese have abundant training data, many languages lack sufficient resources. Our approach:
- Partner with native speaker communities
- Create custom annotation guidelines
- Validate output with cultural experts
- Continuously improve based on feedback

## Real-World Applications

From customer service chatbots to content moderation systems, multilingual AI serves billions of people worldwide. Quality matters more than ever.`,
        category: 'Multilingual AI',
        author: {
            name: 'Dr. Priya Sharma',
            role: 'Chief Linguist',
            avatar: ''
        },
        featuredImage: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&h=600&fit=crop',
        readTime: '7 min read',
        published: true,
        tags: ['Multilingual', 'Localization', 'Cultural AI']
    },
    {
        title: 'AI Safety: The Role of Human Oversight',
        excerpt: 'As AI systems become more powerful, the responsibility of ensuring safety and ethical deployment grows. Here\'s how human oversight makes the difference.',
        content: `The rapid advancement of AI capabilities has brought unprecedented opportunities—and unprecedented risks. Human oversight is the critical layer between powerful AI and responsible deployment.

## Types of AI Safety Concerns

1. **Bias and Fairness**: AI systems can perpetuate or amplify societal biases
2. **Hallucinations**: Language models sometimes generate false information with confidence
3. **Toxic Content**: Models may produce harmful, offensive, or dangerous outputs
4. **Privacy Violations**: Training data might leak sensitive information

## The Human Safety Layer

Automated systems alone cannot ensure AI safety. We need human experts to:
- Identify subtle forms of bias
- Catch hallucinations that seem plausible
- Recognize culturally-specific harms
- Make ethical judgment calls

## Our Approach at Alanxa

We've developed specialized teams focused on different aspects of AI safety:
- Red teaming to find vulnerabilities
- Bias detection across demographics
- Truth verification for factual claims
- Content policy enforcement

The future of AI depends on getting safety right. Human oversight isn't a bottleneck—it's our most important safeguard.`,
        category: 'AI Safety',
        author: {
            name: 'David Kim',
            role: 'VP of Safety & Ethics',
            avatar: ''
        },
        featuredImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop',
        readTime: '9 min read',
        published: true,
        tags: ['AI Safety', 'Ethics', 'Responsible AI']
    }
];

async function seedBlogs() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing blogs
        await Blog.deleteMany({});
        console.log('Cleared existing blogs');

        // Insert sample blogs
        await Blog.insertMany(sampleBlogs);
        console.log('Sample blogs inserted successfully!');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding blogs:', error);
        process.exit(1);
    }
}

seedBlogs();
