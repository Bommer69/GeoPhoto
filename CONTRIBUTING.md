# 🤝 Contributing to GeoPhoto

Thank you for considering contributing to GeoPhoto! We welcome contributions from everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## 🎯 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Java version, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Rationale** for the enhancement
- **Possible implementation** (if you have ideas)
- **Examples** from other projects (if relevant)

### Pull Requests

- Fill in the required template
- Follow the coding standards
- Include appropriate test cases
- Update documentation as needed
- Ensure all tests pass

## 🛠️ Development Setup

### Prerequisites

- Java 17+
- Node.js 18+
- MongoDB 7.0+
- Maven 3.8+

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🔄 Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated and passing
- [ ] Dependent changes merged

## 📐 Coding Standards

### Java/Spring Boot

- Follow **Java Code Conventions**
- Use **meaningful variable names**
- Add **JavaDoc** for public methods
- Keep methods **short and focused**
- Handle **exceptions appropriately**

```java
/**
 * Upload a photo with GPS metadata extraction
 * 
 * @param file The multipart file to upload
 * @param description Optional description
 * @param user The current authenticated user
 * @return PhotoDTO containing the saved photo data
 * @throws RuntimeException if upload fails
 */
public PhotoDTO uploadPhoto(MultipartFile file, String description, User user) {
    // Implementation
}
```

### JavaScript/React

- Use **functional components** and hooks
- Follow **React best practices**
- Use **meaningful component/variable names**
- Add **JSDoc** for complex functions
- Use **PropTypes** for props validation

```javascript
/**
 * PhotoUpload Component
 * Handles photo selection, preview, and upload to server
 * 
 * @param {Function} onUploadSuccess - Callback after successful upload
 */
const PhotoUpload = ({ onUploadSuccess }) => {
    // Implementation
}

PhotoUpload.propTypes = {
    onUploadSuccess: PropTypes.func
}
```

### Git Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests

```
feat: Add reverse geocoding for photo locations

- Integrate Nominatim API
- Display address in photo details
- Add loading state for address fetch

Closes #123
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## 🧪 Testing

### Backend Tests

```bash
cd backend
mvn test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📝 Documentation

- Update README.md for user-facing changes
- Update inline comments for code changes
- Update API documentation for endpoint changes
- Add examples for new features

## 🎨 UI/UX Guidelines

- Follow existing design patterns
- Ensure responsive design (mobile + desktop)
- Test on multiple browsers
- Maintain accessibility standards
- Use Tailwind CSS classes consistently

## ❓ Questions?

Feel free to open an issue with the `question` label if you have any questions!

---

Thank you for contributing to GeoPhoto! 🙏

