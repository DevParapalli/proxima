---
theme: ./
title: Deck title
themeConfig:
  accent: indigo
  label: Series label
  date: Session · Year
  presenter: Presenter
layout: cover
number: 0
side: Audience or classification
facts: [Duration, Format, Part n of m]
---

# Deck title in five words or fewer

One sentence stating what the audience can do after this session.

---
layout: outline
current: 1
---

# What this session covers

---
layout: section
---

# Section title

Who this section is for.

---
layout: display
---

# Display slide

One term or number, shown large

## Keyword

---

# Claim slide: the title states the conclusion as a full sentence

<Cols widths="1.2fr 1fr">
<Col>

Left column carries the argument in two or three sentences. Use **highlight** for the single phrase the audience must remember.

</Col>
<Col>

- Supporting point one
- Supporting point two
- Supporting point three
- Supporting point four

</Col>
</Cols>

<!--
Speaker notes: what to say, what to ask the room, when to advance.
-->

---
layout: split
---

# Split slide: three parallel options

Same shape per panel, one line of contrast each.

1. **Option A** What it is. Its main strength, its main weakness.
2. **Option B** What it is. Its main strength, its main weakness.
3. **Option C** What it is. Its main strength, its main weakness.

---
layout: statement
---

# One sentence with a **highlighted phrase** that the deck returns to.

Optional one-line context under the statement.

---
layout: explain
---

# Explain slide: four terms, one definition each

| Term one | Definition in one sentence. |
|---|---|
| Term two | Definition in one sentence. |
| Term three | Definition in one sentence, with a second clause if needed. |
| Term four | Definition in one sentence. |

---
source: Source line
---

# Claim with stats: the title states what the numbers prove

<Cols widths="1fr 1.1fr">
<Col>

Before-and-after framing in two sentences. The numbers on the right carry the evidence.

</Col>
<Col>
<Stats>
  <Stat value="000" label="first metric" />
  <Stat value="00" label="second metric" />
  <Stat value="0 s" label="third metric" />
</Stats>
</Col>
</Cols>

---
layout: exhibit
source: Source line
---

# Column chart: the title states the trend, not the axes

<ColumnsChart :height="217" :items="[['Series A', 60, '60%'], ['Series B', 75, '75%'], ['Series C', 85, '85%'], ['Series D', 90, '90%']]" />

---
layout: exhibit
source: Source line
---

# Bar chart: sorted descending, labels carry units

<BarsChart :items="[['Category A', 65], ['Category B', 42], ['Category C', 18], ['Category D', 12]]" />

---
layout: compare
pick: right
---

# Compare slide: the title states when each side applies

::left::

## Left option

- Condition one
- Condition two
- Condition three

::right::

## Right option

- Condition one
- Condition two
- Condition three

---
layout: steps
current: 3
---

# Steps slide: a fixed sequence, current step marked

1. Step one
2. Step two
3. Step three
4. Step four
5. Step five

---
layout: exercise
minutes: 10
---

# Exercise slide: imperative title

What participants do, in whatever grouping, with what materials.

::output::

What they produce by the end, stated concretely.

---
layout: section
accent: teal
---

# Second section

Who this section is for.

---
layout: code
file: code/example.py
accent: teal
---

# Code slide: the title states what the code demonstrates

```python {3,4}
import re

def classify(text: str) -> str:
    if re.search(r"pattern", text, re.I):
        return "match"
    return "default"
```

---
layout: quote
attribution: Attribution
---

A single sentence worth repeating, one or two lines long.

---
layout: close
contact: Contact line.
---

# What to do next

1. First action for the audience.
2. Second action for the audience.
3. Third action for the audience.
