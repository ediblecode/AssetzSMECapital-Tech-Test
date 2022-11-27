# Follow Up Questions

### Q. Whats the command(s) for setting up and running your application?

Install Node 18+ (or use Volta). `cd` into the *web* folder. Run `npm ci` to install Node dependencies. Run `npm run dev` and open a browser at http://localhost:3000/.

### Q. If you had more time, what improvement or features would you add?

- More tests, and specifically:
  - Integration tests that test that the props returned from `getServerSideProps` result in the correct rendered markup
  - Functional, browser-based tests
  - Automated accessibility tests
- Better/more obvious focus rings
- ARIA live announcements
- Some more lower-level unit test and refactor the inline snapshot tests
- Prettier/ESLint rules
- Separate (decoupled) API project
- Pagination
- Filter by investor name
- Add SCSS for design tokens (colours/consistent spacing)
- Pre-commit checks (linting/tests with Husky or similar)
- Better IDE test runner integration
- Usage analytics
- Performance optimisations inline SVG logo, network waterfall analysis
  - Explore NextJS app directory and Server Components
- Force revalidation via Cache-Control to mitigate 
- Set default best-practice headers for security (CSP etc)
- Validation of query string values

### Q. Which part(s) of your solution are you most proud of? And why?

The progressive enhancement, so all the functionality (filters, sorting, BoE rate) all work without JavaScript.

### Q. Which part of the challenge did you find most difficult? And why?

Choosing where/how to handle floating point issues and rounding. Didn't want to round too early and result in incorrect calculations based on using rounding values.

Deciding where to do the data traversal/manipulation. I opted for the server, with custom endpoints, to keep the UI layer fairly 'dumb' and focussed around templating and interactivity.

### Q. If a stakeholder was present, what questions might you ask them?

- Is there a product roadmap and vision?
- How many users of the system?
- What authentication is needed?
- Can some users only see certain accounts?
- How often does the data get refreshed?
- What sort of numbers of investors, holdings and accounts are forecast?
- Is it internal only/behind a firewall or internet facing?

### Q. How did you find the challenge overall? We would love to hear any feedback you might have.

Fun. Good mixture of data wrangling, UI and styling. Plenty of scope to show what you can do and do it how you want, either 'full stack' like I've done or pure client-side.

### Q. Do you have any other comments we should read before evaluating your solution?

I've added a few tests to show examples of pure unit tests as well as React UI ones using React Testing Library, but the coverage could be better. There are a few `it.todo` placeholders to indicate the sorts of missing ones.