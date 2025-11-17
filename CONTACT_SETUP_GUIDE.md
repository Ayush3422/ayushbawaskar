# Contact Section Setup Guide

## 🎯 Overview
The Contact section now features prominent call-to-action buttons, embedded social media links (LinkedIn, GitHub, Google Colab), and an enhanced contact form to make it easy for recruiters and teams to reach out.

## 📝 What to Customize

### 1. **Social Media Links** (in `src/sections/Contact.jsx`)

Find the `socialLinks` array and update:

```javascript
const socialLinks = [
  { 
    icon: Linkedin, 
    label: 'LinkedIn', 
    href: 'https://linkedin.com/in/yourprofile', // ← UPDATE THIS
    // ...
    username: '@yourprofile' // ← UPDATE THIS
  },
  { 
    icon: Github, 
    label: 'GitHub', 
    href: 'https://github.com/yourusername', // ← UPDATE THIS
    // ...
    username: '@yourusername' // ← UPDATE THIS
  },
  { 
    icon: Code2, 
    label: 'Google Colab', 
    href: 'https://colab.research.google.com/drive/yournotebook', // ← UPDATE THIS
    // ...
  },
  { 
    icon: Mail, 
    label: 'Email', 
    href: 'mailto:your.email@example.com', // ← UPDATE THIS
    // ...
    username: 'your.email@example.com' // ← UPDATE THIS
  },
];
```

### 2. **Call-to-Action Buttons**

Update the `callToActions` array:

```javascript
const callToActions = [
  {
    icon: Briefcase,
    title: 'Hire Me',
    description: 'Looking for a talented developer? Let\'s build something amazing together.',
    buttonText: 'View Resume',
    buttonColor: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600',
    href: '#', // ← ADD YOUR RESUME LINK (Google Drive, Dropbox, or hosted PDF)
    external: true
  },
  {
    icon: Users,
    title: 'Collaborate',
    description: 'Have an exciting project idea? I\'m open to collaborations and partnerships.',
    buttonText: 'Start Collaboration',
    buttonColor: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    href: 'mailto:your.email@example.com?subject=Collaboration Opportunity', // ← UPDATE EMAIL
    external: false
  },
  {
    icon: MessageSquare,
    title: 'Discuss a Project',
    description: 'Want to discuss your next big idea? I\'m all ears for innovative projects.',
    buttonText: 'Schedule a Call',
    buttonColor: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
    href: '#', // ← ADD YOUR CALENDLY/SCHEDULING LINK
    external: true
  }
];
```

### 3. **Email in Form Handler**

Update the `handleSubmit` function:

```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  const subject = encodeURIComponent('Portfolio Contact from ' + formData.name);
  const body = encodeURIComponent(
    `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
  );
  window.location.href = `mailto:your.email@example.com?subject=${subject}&body=${body}`;
  // ↑ UPDATE THIS EMAIL
};
```

### 4. **Chatbot Answers** (in `src/data/chatbotAnswers.js`)

Update contact information in the chatbot's knowledge base:

```javascript
// Contact
contact: {
  patterns: ['contact', 'email', 'reach', 'hire', 'connect', 'get in touch', 'linkedin', 'github profile', 'colab'],
  responses: [
    "Let's connect! 🚀\n\n📧 Email: your.email@example.com\n💼 LinkedIn: linkedin.com/in/yourprofile\n💻 GitHub: github.com/yourusername\n🔬 Google Colab: Check out my ML notebooks\n\nScroll to the Contact section to send a message or click the social links. I'm open for hiring, collaborations, and project discussions!"
    // ↑ UPDATE ALL THESE LINKS
  ]
},

// Hiring
hire: {
  patterns: ['hire', 'hire me', 'hiring', 'job', 'opportunity', 'available', 'freelance'],
  responses: [
    "I'm actively looking for opportunities! 💼\n\n✅ Open for full-time positions\n✅ Available for freelance projects\n✅ Interested in collaborations\n\nCheck out my resume in the Contact section or reach out directly at your.email@example.com. Let's build something amazing together!"
    // ↑ UPDATE EMAIL
  ]
},
```

## 🔗 Recommended Links to Add

### Resume/CV
- **Google Drive**: Share a PDF with view permissions
- **Dropbox**: Public link to your resume
- **Personal Website**: Host on GitHub Pages
- **PDF Link**: Direct link to `public/resume.pdf`

### Google Colab
- Share your public notebooks
- Create a collection of your best ML experiments
- Link to your Colab profile or specific notebooks

### Scheduling
- **Calendly**: calendly.com/yourusername
- **Cal.com**: cal.com/yourusername
- **Google Calendar**: Create an appointment scheduling page

## 🎨 Features Included

### Call-to-Action Cards
- ✅ **Hire Me** - Links to your resume
- ✅ **Collaborate** - Opens email for collaboration
- ✅ **Discuss a Project** - Schedule a call

### Social Media Cards
- ✅ **LinkedIn** - Professional networking
- ✅ **GitHub** - Code repositories
- ✅ **Google Colab** - ML notebooks
- ✅ **Email** - Direct contact

### Contact Form
- ✅ Name, email, and message fields
- ✅ Opens default email client with pre-filled subject
- ✅ Glassmorphism design with smooth animations

### Quick Stats
- ✅ 24h response time
- ✅ 100% client satisfaction
- ✅ Open for opportunities

## 💡 Tips

1. **Resume Link**: Host your resume on Google Drive and make it public, or add it to the `public/` folder
2. **LinkedIn**: Use your custom LinkedIn URL (linkedin.com/in/yourname)
3. **GitHub**: Link to your GitHub profile, not a specific repository
4. **Google Colab**: Share a collection or your most impressive notebooks
5. **Scheduling**: Set up Calendly or Cal.com for easy meeting scheduling
6. **Email**: Use a professional email address

## 🚀 Testing

After updating:
1. Click all social media links to verify they work
2. Test the CTA buttons (Hire Me, Collaborate, Schedule Call)
3. Submit the contact form to ensure email opens correctly
4. Ask the chatbot about contact/hiring to verify responses

## 📱 Mobile Responsive

The contact section is fully responsive:
- Cards stack vertically on mobile
- Social links are touch-friendly
- Form inputs are optimized for mobile keyboards

## 🎯 SEO & Accessibility

- All links have `rel="noopener noreferrer"` for security
- Proper `aria-label` attributes for screen readers
- External link icons for better UX
- Semantic HTML structure

---

**Ready to receive opportunities!** Once you update these links, recruiters and collaborators can easily reach you through multiple channels. 🎉
