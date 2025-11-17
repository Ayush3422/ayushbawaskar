export const learningLog = [
  {
    id: 1,
    date: '2024-10-15',
    title: 'Building a 3D Portfolio with React Three Fiber',
    category: 'Frontend',
    tags: ['React', 'Three.js', 'WebGL', '3D Graphics'],
    excerpt: 'Created an immersive 3D portfolio using React Three Fiber. Learned about particle systems, custom shaders, and performance optimization.',
    content: `# Building a 3D Portfolio with React Three Fiber

## What I Built
I created an interactive 3D background for my portfolio using React Three Fiber and custom GLSL shaders.

### Key Learnings

#### 1. Particle Systems
\`\`\`javascript
const particles = useMemo(() => {
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
  }
  return positions;
}, []);
\`\`\`

#### 2. Custom GLSL Shaders
Created wave animations using vertex shaders:
- Sine/cosine wave displacement
- Time-based animations
- Gradient coloring based on elevation

#### 3. Performance Optimization
- Used \`useMemo\` for expensive calculations
- Implemented lazy loading with Suspense
- GPU-accelerated animations
- Particle count optimization (50-100 particles max)

### Results
- ✅ 60 FPS on mid-tier GPUs
- ✅ Responsive 3D interactions
- ✅ Fallback to 2D on WebGL errors

**XP Gained:** +400 | **Badges Earned:** Three.js Explorer`,
    readTime: '8 min',
    xpGained: 400,
    skillsImproved: ['React', 'Three.js', 'GLSL']
  },
  {
    id: 2,
    date: '2024-10-10',
    title: 'Optimizing Neural Networks with Pruning',
    category: 'Deep Learning',
    tags: ['Neural Networks', 'Optimization', 'PyTorch'],
    excerpt: 'Explored various pruning techniques to reduce model size while maintaining accuracy. Achieved 60% reduction in parameters with only 2% accuracy drop.',
    content: `# Neural Network Pruning Deep Dive

## The Challenge
My trained CNN model was 250MB - too large for edge deployment.

## Solution: Pruning Techniques

### 1. Magnitude-Based Pruning
\`\`\`python
import torch.nn.utils.prune as prune

# Prune 40% of weights in conv layers
prune.l1_unstructured(model.conv1, name='weight', amount=0.4)
prune.l1_unstructured(model.conv2, name='weight', amount=0.4)
\`\`\`

### 2. Structured Pruning
Removed entire filters/channels:
- Better for hardware acceleration
- More significant speed improvements
- Slightly lower accuracy than unstructured

### Key Findings
| Method | Size Reduction | Accuracy Loss | Speed Gain |
|--------|---------------|---------------|------------|
| Unstructured | 60% | 2% | 15% |
| Structured | 50% | 4% | 35% |
| Gradual | 60% | 1.5% | 18% |

### Best Practices
1. **Gradual pruning** works better than one-shot
2. **Fine-tune** after each pruning iteration
3. **Layer-wise rates** - vary by layer importance
4. **Iterative approach** - prune 10-20% at a time

**Final Result:** 100MB model, 98% accuracy ✨

**XP Gained:** +350`,
    readTime: '10 min',
    xpGained: 350,
    skillsImproved: ['PyTorch', 'Deep Learning', 'Model Optimization']
  },
  {
    id: 3,
    date: '2024-10-08',
    title: 'Real-Time Analytics with Apache Kafka',
    category: 'Data Engineering',
    tags: ['Kafka', 'Streaming', 'Real-time', 'Node.js'],
    excerpt: 'Set up a real-time data pipeline using Kafka for processing user events at scale.',
    content: `# Building a Real-Time Analytics Pipeline

## Architecture Overview
\`\`\`
Events → Kafka Producer → Kafka Broker → Consumer → MongoDB
\`\`\`

## Implementation

### Producer Setup
\`\`\`javascript
const kafka = new Kafka({
  clientId: 'analytics-app',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

// Send events
await producer.send({
  topic: 'user-events',
  messages: [{ value: JSON.stringify(event) }]
});
\`\`\`

### Consumer with Windowing
\`\`\`javascript
const consumer = kafka.consumer({ groupId: 'analytics-group' });

await consumer.run({
  eachMessage: async ({ message }) => {
    const event = JSON.parse(message.value.toString());
    await processEvent(event);
  }
});
\`\`\`

## Lessons Learned
- **Partitioning** is crucial for scalability
- **Consumer groups** enable parallel processing
- **Offset management** prevents data loss
- **Batch processing** reduces DB load

### Performance
- 📊 Processing: 10,000+ events/second
- ⚡ Latency: <50ms average
- 🔄 Uptime: 99.9%

**XP Gained:** +300`,
    readTime: '7 min',
    xpGained: 300,
    skillsImproved: ['Kafka', 'Node.js', 'System Design']
  },
  {
    id: 4,
    date: '2024-10-05',
    title: 'Implementing Attention Mechanisms from Scratch',
    category: 'NLP',
    tags: ['Transformers', 'Attention', 'PyTorch', 'Deep Learning'],
    excerpt: 'Deep dive into self-attention and multi-head attention mechanisms. Built a mini-transformer for text classification.',
    content: `# Understanding Transformers: Attention is All You Need

## Self-Attention Implementation

### Query, Key, Value
\`\`\`python
import torch
import torch.nn as nn

class SelfAttention(nn.Module):
    def __init__(self, embed_dim, heads):
        super().__init__()
        self.heads = heads
        self.head_dim = embed_dim // heads
        
        self.query = nn.Linear(embed_dim, embed_dim)
        self.key = nn.Linear(embed_dim, embed_dim)
        self.value = nn.Linear(embed_dim, embed_dim)
        self.fc_out = nn.Linear(embed_dim, embed_dim)
    
    def forward(self, x):
        N, seq_len, embed_dim = x.shape
        
        # Split into multiple heads
        Q = self.query(x).reshape(N, seq_len, self.heads, self.head_dim)
        K = self.key(x).reshape(N, seq_len, self.heads, self.head_dim)
        V = self.value(x).reshape(N, seq_len, self.heads, self.head_dim)
        
        # Scaled dot-product attention
        energy = torch.einsum("nqhd,nkhd->nhqk", [Q, K])
        attention = torch.softmax(energy / (self.head_dim ** 0.5), dim=3)
        
        out = torch.einsum("nhql,nlhd->nqhd", [attention, V])
        out = out.reshape(N, seq_len, embed_dim)
        
        return self.fc_out(out)
\`\`\`

## Key Insights
1. **Scaling factor** (√d_k) prevents softmax saturation
2. **Multi-head** allows attending to different positions
3. **Positional encoding** crucial for sequence order
4. **Layer normalization** stabilizes training

### Results
- ✅ Text classification: 92% accuracy
- ✅ Understanding of attention mechanics
- ✅ Foundation for advanced NLP

**XP Gained:** +450`,
    readTime: '12 min',
    xpGained: 450,
    skillsImproved: ['PyTorch', 'NLP', 'Transformers']
  },
  {
    id: 5,
    date: '2024-10-01',
    title: 'Smart Contract Security Best Practices',
    category: 'Blockchain',
    tags: ['Solidity', 'Security', 'Web3', 'Smart Contracts'],
    excerpt: 'Learned critical security patterns for Solidity development after auditing vulnerable contracts.',
    content: `# Smart Contract Security: Lessons Learned

## Common Vulnerabilities

### 1. Reentrancy Attack
**Bad:**
\`\`\`solidity
function withdraw() public {
    uint amount = balances[msg.sender];
    (bool success,) = msg.sender.call{value: amount}("");
    require(success);
    balances[msg.sender] = 0; // ❌ Update after external call
}
\`\`\`

**Good (Checks-Effects-Interactions):**
\`\`\`solidity
function withdraw() public {
    uint amount = balances[msg.sender];
    balances[msg.sender] = 0; // ✅ Update state first
    (bool success,) = msg.sender.call{value: amount}("");
    require(success);
}
\`\`\`

### 2. Integer Overflow/Underflow
Use OpenZeppelin's SafeMath or Solidity 0.8+ (built-in checks)

### 3. Access Control
\`\`\`solidity
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyContract is Ownable {
    function criticalFunction() public onlyOwner {
        // Only owner can call
    }
}
\`\`\`

## Security Checklist
- ✅ Use latest Solidity version (0.8+)
- ✅ Implement reentrancy guards
- ✅ Follow checks-effects-interactions pattern
- ✅ Use OpenZeppelin contracts
- ✅ Get professional audits
- ✅ Test with Hardhat/Foundry
- ✅ Monitor with Defender

**XP Gained:** +400`,
    readTime: '9 min',
    xpGained: 400,
    skillsImproved: ['Solidity', 'Security', 'Web3']
  }
];
