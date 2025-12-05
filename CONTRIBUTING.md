# 🤝 Contributing to PycShop

Chào mừng bạn đến với PycShop! Chúng tôi rất vui mừng khi có sự đóng góp từ cộng đồng. README này sẽ hướng dẫn bạn cách contribute hiệu quả.

## 🚀 Quick Start for Contributors

### 1. Setup Development Environment

```bash
# Fork và clone repository
git clone https://github.com/your-username/pycshop.git
cd pycshop

# Install dependencies
npm install

# Setup database
npm run setup-db

# Start development environment
npm run start:full-realtime
```

### 2. Development Workflow

```bash
# Tạo feature branch
git checkout -b feature/your-feature-name

# Make changes và test
npm run test
npm run lint

# Commit với conventional commits
git commit -m "feat: add new chat feature"

# Push và tạo Pull Request
git push origin feature/your-feature-name
```

## 📋 Contribution Guidelines

### 🎯 Types of Contributions

**🐛 Bug Fixes**

- Fix existing functionality
- Add tests for the fix
- Update documentation if needed

**✨ New Features**

- Discuss trong Issues trước khi implement
- Follow existing code patterns
- Add comprehensive tests
- Update README if applicable

**📚 Documentation**

- Improve existing docs
- Add missing documentation
- Fix typos và grammar
- Add examples và tutorials

**🎨 UI/UX Improvements**

- Follow PycShop design system
- Ensure mobile responsiveness
- Test accessibility features
- Maintain consistent styling

### 🔧 Code Standards

**Frontend (React/JavaScript):**

```javascript
// Use functional components với hooks
const ChatWidget = ({ shopId, userId }) => {
  const [messages, setMessages] = useState([]);

  // Use proper naming conventions
  const handleSendMessage = useCallback((message) => {
    // Implementation
  }, []);

  return <div className="chat-widget">{/* JSX content */}</div>;
};
```

**Backend (Node.js/Express):**

```javascript
// Use async/await thay vì callbacks
const createOrder = async (req, res) => {
  try {
    const order = await orderService.create(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

**CSS/Styling:**

```css
/* Use BEM methodology */
.chat-widget {
  /* Container styles */
}

.chat-widget__header {
  /* Header styles */
}

.chat-widget__message--sent {
  /* Modifier for sent messages */
}

/* Use CSS custom properties */
:root {
  --pycshop-primary: #297d4e;
}
```

### 🧪 Testing Requirements

**Unit Tests:**

```bash
# Frontend component tests
npm run test

# Backend API tests
npm run test:backend

# Coverage reports
npm run test:coverage
```

**Integration Tests:**

```bash
# End-to-end testing
npm run test:e2e

# Real-time features
npm run test:realtime

# API integration
npm run test:api
```

**Manual Testing Checklist:**

- [ ] Feature hoạt động đúng trên desktop
- [ ] Responsive trên mobile & tablet
- [ ] Real-time notifications work
- [ ] Chat system functions properly
- [ ] No console errors
- [ ] Accessibility với keyboard navigation

### 📝 Commit Message Convention

Sử dụng [Conventional Commits](https://conventionalcommits.org/):

```bash
# Feature
git commit -m "feat(chat): add typing indicator animation"

# Bug fix
git commit -m "fix(orders): resolve real-time notification issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Style changes
git commit -m "style(chat): improve message bubble design"

# Refactoring
git commit -m "refactor(auth): simplify JWT validation logic"

# Performance
git commit -m "perf(api): optimize database queries"
```

### 🔍 Pull Request Process

**Before Submitting:**

1. ✅ All tests pass (`npm run test`)
2. ✅ Code follows style guidelines (`npm run lint`)
3. ✅ Documentation updated if needed
4. ✅ Manual testing completed
5. ✅ Real-time features verified

**PR Template:**

```markdown
## 🎯 Description

Brief description of changes

## 🔧 Type of Change

- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 📚 Documentation update
- [ ] 🎨 UI/UX improvement
- [ ] 🚀 Performance optimization

## 🧪 Testing Done

- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Real-time features tested
- [ ] Mobile responsiveness checked

## 📱 Screenshots (if applicable)

Add screenshots for UI changes

## 🔗 Related Issues

Closes #issue-number
```

### 🗂️ Project Structure for Contributors

**Frontend Components:**

```
src/components/
├── admin/          # Admin dashboard components
├── buyers/         # Buyer interface components
├── common/         # Shared components
│   ├── GlobalChatWidget/  # Modern chat system
│   ├── Header/     # Navigation header
│   └── Footer/     # Site footer
├── layout/         # Layout components
└── seller/         # Seller dashboard components
```

**Backend Services:**

```
microservice/
├── api_gateway/    # Main API gateway (port 5000)
├── auth_service/   # Authentication (port 5001)
├── product_service/ # Products (port 5002)
├── shop_service/   # Seller dashboard (port 5003)
├── chat_service/   # Chat system (port 5004)
├── cart_service/   # Shopping cart (port 5005)
├── danhgia_service/ # Reviews (port 5006)
├── order_service/  # Orders (port 5007)
├── notification_service/ # Real-time (port 5008)
├── user_service/   # Users (port 5009)
└── promotion_service/ # Promotions (port 5010)
```

## 🎨 Design System Guidelines

### 🎯 Brand Colors

```css
:root {
  --pycshop-primary: #297d4e; /* Main brand color */
  --pycshop-primary-dark: #166534; /* Dark variant */
  --pycshop-primary-light: #34d399; /* Light variant */
  --pycshop-accent: #10b981; /* Accent color */
}
```

### 💬 Chat System Design

**Follow existing patterns:**

- Glass morphism effects với backdrop-filter
- Font Awesome icons thay vì text/emoji
- Smooth animations với CSS transitions
- Mobile-first responsive design
- PycShop color scheme consistency

### 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
.component {
  /* Base styles for mobile (320px+) */
}

@media (min-width: 768px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}

@media (min-width: 1280px) {
  /* Large desktop */
}
```

## 🚀 Real-time Development

### 🔔 Kafka Event Patterns

```javascript
// Producer pattern
const producer = kafka.producer();
await producer.send({
  topic: "order-events",
  messages: [
    {
      key: orderId,
      value: JSON.stringify({
        type: "ORDER_CREATED",
        orderId,
        sellerId,
        buyerId,
        timestamp: Date.now(),
      }),
    },
  ],
});

// Consumer pattern
const consumer = kafka.consumer({ groupId: "notification-service" });
await consumer.subscribe({ topic: "order-events" });
await consumer.run({
  eachMessage: async ({ message }) => {
    const event = JSON.parse(message.value.toString());
    await handleOrderEvent(event);
  },
});
```

### 📡 WebSocket Patterns

```javascript
// Server-side (notification service)
io.to(`seller_${sellerId}`).emit("new_order", {
  orderId,
  customerName,
  totalAmount,
  timestamp: Date.now(),
});

// Client-side (React component)
useEffect(() => {
  socket.on("new_order", (data) => {
    setNotifications((prev) => [...prev, data]);
    showToast("New order received!");
  });

  return () => socket.off("new_order");
}, []);
```

## 🐛 Debugging Tips

### 🔍 Common Debug Scenarios

**Kafka Connection Issues:**

```bash
# Check Kafka topics
docker exec pycshop-kafka kafka-topics.sh --bootstrap-server localhost:9092 --list

# View topic messages
docker exec pycshop-kafka kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic order-events \
  --from-beginning
```

**WebSocket Debugging:**

```javascript
// Enable Socket.IO debugging
localStorage.debug = "socket.io-client:socket";

// Check connection status
socket.on("connect", () => console.log("Connected to WebSocket"));
socket.on("disconnect", () => console.log("Disconnected from WebSocket"));
```

**Database Query Optimization:**

```sql
-- Enable query logging
SET global general_log = 1;
SET global general_log_file = '/var/log/mysql/general.log';

-- Analyze slow queries
EXPLAIN SELECT * FROM donhang WHERE nguoidung_id = 1;
```

## 🏆 Recognition

**Top Contributors được recognition qua:**

- 🌟 GitHub repository credits
- 📝 Mention trong release notes
- 🎖️ Special badges trong Discord/Slack
- 📢 Social media shoutouts

**Contribution Levels:**

- 🥉 **Bronze**: 1-5 merged PRs
- 🥈 **Silver**: 6-15 merged PRs
- 🥇 **Gold**: 16+ merged PRs
- 💎 **Diamond**: Major feature contributions

## 📞 Getting Help

**Need Help? Multiple ways to reach us:**

- 💬 **GitHub Discussions** - For questions & ideas
- 🐛 **GitHub Issues** - For bug reports & feature requests
- 📧 **Email** - [maintainer@pycshop.com](mailto:maintainer@pycshop.com)
- 💭 **Discord** - Join our community server
- 📋 **Code Review** - Tag maintainers trong PR

**Response Times:**

- 🐛 Bug reports: 24-48 hours
- ✨ Feature requests: 1 week
- 📝 Documentation: 2-3 days
- 🤝 General questions: 1-2 days

---

## 🙏 Thank You!

Cảm ơn bạn đã quan tâm đến việc contribute cho PycShop! Mọi đóng góp, dù nhỏ hay lớn, đều rất có giá trị và giúp làm cho platform này tốt hơn cho cả cộng đồng.

**Happy Coding! 🚀**

<div align="center">
  <p>Made with ❤️ by the PycShop Community</p>
</div>
