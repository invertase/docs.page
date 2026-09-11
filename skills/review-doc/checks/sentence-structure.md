# sentence-structure

Finish every Scan on the whole page. Classify each instance: violation, skip, or clean.

### condition-first

- **Scan:** every imperative instruction (`click`, `set`, `add`, numbered steps)
- **Finding if:** the instruction comes before the condition or goal (*Click **Delete** if you want to delete*)
- **Skip if:** the page has no procedure (concept / overview)

### svo

- **Scan:** sentences that bury the verb after a long setup
- **Finding if:** the main subject and verb are not near the start, and the sentence is an instruction or a description of product behavior
- **Skip if:** a short sentence that is already subject + verb + object; a leading `if` / `when` / `after` / `to` / `for` clause that the rest of the sentence depends on — `condition-first` requires that order and wins; still a finding if that clause could stand on its own as a separate sentence
