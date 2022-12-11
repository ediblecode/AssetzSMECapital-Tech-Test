# Follow Up Questions

### Q. Whats the command(s) for setting up and running your application?

Install Node 18+ (or use Volta). Run the NextJS web app from the [web](../web/) folder (this is need to provide the API for the data). Run `npm ci` to install Node dependencies. Run `npm start`.

### Q. If you had more time, what improvement or features would you add?

Format currency values in displayed table to 2 decimal places.

Error handling (promise rejection) and nice messages.

Use a library to do the compounding interest calculations, or abstract it to a separate function.

Calculate 'value in a year' based off whether it's a leap year for each day, to cater for financial years not aligning with calendar years.

Abstract common types between the 2 projects (API responses), rather than referencing them.

TypeScript aliases/project references to make nicer paths, and aid decoupling (essentially like a monorepo).

Decouple CLI part from core business logic.

Add injectable config (e.g. for base API, additional promotion rate, bonus threshold etc).

Use 'proper' ESM and top level await so index doesn't need the `.then`. Syntatic sugar but ¯\_(ツ)_/¯

Offload some of the logic to the server behind the API e.g. getting use the `investorholdings` endpoint.

Get the tests to configure their own DI container with appropriate, manually created dependencies - currently they're reliant on the global DI config, so they're brittle.

Add auth to the API.

Some kind of 'proper' integration test that hits an actual API, not just mocked with Axios.

### Q. Which part(s) of your solution are you most proud of? And why?

The DI, decoupling and clear responsibilities between classes.

The easily testable code, with good coverage

### Q. Which part of the challenge did you find most difficult? And why?

The compound interest maths was fun :)

Deciding what a promotion should know about/have access to.

### Q. If a stakeholder was present, what questions might you ask them?

Does the bonus rate apply to multiple holdings if there are 2 with the same balance?

Can multiple promotions be combined? Or do we take the largest/smallest promotion value?

Does annual accrual need to be calculated from an arbitrary date? And what happens if that goes from a non-leap year into a leap year?

### Q. How did you find the challenge overall? We would love to hear any feedback you might have.

Good size of task. Interesting mix of maths/algorithm as well as code structuring. Scope to be able to do things like 'proper' DI here.

### Q. Do you have any other comments we should read before evaluating your solution?

It's probably somewhat contrived (!) and the DI is probably overkill for such a small app but the IoC is nice, makes testable code and hopefully shows backend knowledge.