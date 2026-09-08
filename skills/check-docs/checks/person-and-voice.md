# person-and-voice

Finish every Scan on the whole page. Classify each instance: violation, skip, or clean.

### we-lets-i

- **Scan:** every `we`, `our`, `us`, `let's`, `I`
- **Finding if:** reader action uses those words (*how we can create*, *let's add*)
- **Skip if:** quoting a third party; the publishing organization as actor (support hours)

### mixed-person

- **Scan:** every sentence that names who acts
- **Finding if:** person mixes in one paragraph (`teams who` + `your own`)
- **Skip if:** the product as a factual actor

### active-voice

- **Scan:** every sentence whose verb is *is/are/was/were* + past participle (*is queried*, *an acknowledgment is sent*)
- **Finding if:** the actor is the reader or a named system and the sentence could be active (*Send a query. The server sends an acknowledgment.*)
- **Skip if:** the object is the point (*The file is saved.*); the actor does not matter (*The database was purged in January.*)

### who-you-is

- **Scan:** the first screen of the page (frontmatter + opening paragraphs)
- **Finding if:** the page tells the reader to do something and never identifies who *you* is (developer, admin)
- **Skip if:** a concept page with no reader task; audience is already named
