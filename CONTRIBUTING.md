# Contributing to the Silver Coin Calculator ✨

First off, thank you for considering contributing! Your help is appreciated and will make this project even better.

This document provides a set of guidelines for contributing to the Silver Coin Calculator. These are mostly guidelines, not strict rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## How Can I Contribute?

There are many ways to contribute, from reporting bugs to suggesting new features and writing code.

### Reporting Bugs

If you find a bug, please ensure it hasn't already been reported by searching the [Issues][issues-url] on GitHub.

If you can't find an existing issue addressing the problem, please [open a new one][new-issue-url]. Be sure to include a **clear title and description**, as much relevant information as possible, and a **step-by-step guide** on how to reproduce the issue.

A good bug report should include:
- A clear and descriptive title.
- Steps to reproduce the bug.
- What you expected to happen.
- What actually happened.
- A screenshot or GIF of the issue, if possible.

### Suggesting Enhancements

If you have an idea for a new feature or an improvement to an existing one, please [open a new issue][new-issue-url] to discuss it. This allows us to coordinate our efforts and prevent duplication of work.

When creating an enhancement suggestion, please include:
- A clear description of the proposed enhancement.
- The "use case" or reason why this enhancement would be useful.
- A step-by-step description of how it might work.

### Your First Code Contribution (Pull Requests)

We welcome pull requests! Here is the basic workflow for submitting a code contribution:

1.  **Fork the repository.**
    Click the "Fork" button at the top right of the project page. This creates a copy of the project in your own GitHub account.

2.  **Clone your fork.**
    Clone the repository to your local machine:
    ```sh
    git clone https://github.com/YOUR_USERNAME/silver-coin-calculator.git
    ```

3.  **Create a new branch.**
    Create a branch for your changes. Use a descriptive name like `feature/add-gold-prices` or `fix/calculation-error`.
    ```sh
    git checkout -b feature/add-gold-prices
    ```

4.  **Make your changes.**
    Make your changes to the code (HTML, CSS, JavaScript). Try to follow the existing code style.

5.  **Test your changes.**
    Run a local web server to ensure that your changes work as expected and have not introduced any new bugs.
    ```sh
    python -m http.server
    ```
    Then, open `http://localhost:8000` in your browser.

6.  **Commit your changes.**
    Commit your changes with a clear and concise commit message.
    ```sh
    git commit -m "feat: Add gold price calculation feature"
    ```

7.  **Push to your branch.**
    Push your changes to your fork on GitHub.
    ```sh
    git push origin feature/add-gold-prices
    ```

8.  **Open a Pull Request.**
    Go to the original repository on GitHub and click the "New pull request" button. Provide a clear title and a description of the changes you've made. If your PR addresses an existing issue, be sure to link it (e.g., "Fixes #123").

Thank you for helping make the Silver Coin Calculator a better tool!

[issues-url]: [https://github.com/giannakopoulosj/giannakopoulosj.github.io]/issues
[new-issue-url]: [https://github.com/giannakopoulosj/giannakopoulosj.github.io]/issues/new/choose