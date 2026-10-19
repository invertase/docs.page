# tone

Finish every Scan on the whole page. Classify each instance: violation, skip, or clean.

### idioms-slang

- **Scan:** idioms, metaphors, slang, pop-culture, humor, exclamation marks (`!`)
- **Finding if:** figurative phrasing that can be literal (*infrastructure tax*); chat slang; a joke; an exclamation
- **Skip if:** a product term the audience searches for, already defined

### padding

- **Scan:** `please note`, `note that`, `it should be noted`, `at this time`
- **Finding if:** the phrase is padding around a fact
- **Skip if:** none

### pre-announcement

- **Scan:** `now`, `new`, `currently`, `soon`, `coming soon`, `latest`, `as of this writing`, `eventually`, `will soon`
- **Finding if:** the sentence pre-announces or dates the product in a way that will rot
- **Skip if:** `new` in dated release notes with a version or date

### repeated-opener

- **Scan:** sentence openers in each paragraph
- **Finding if:** three or more consecutive sentences start with the same opener (*You can*, *To do*)
- **Skip if:** a procedure where parallel imperatives are required
