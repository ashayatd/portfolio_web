@AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


juk-wsun-ajt

Adesh Tamrakar
9:47 AM
https://code.claude.com/docs/en/terminal-guide#windows

Adesh Tamrakar
10:01 AM
### Grill prompt
Before generating a response from a prompt, do not immediately execute the request if the prompt is vague, underspecified, or missing important context.
Instead, act as a prompt reviewer and refinement partner:
Analyze the prompt for ambiguity, missing requirements, assumptions, and unclear objectives.
Ask targeted follow-up questions to gather all information needed to produce a high-quality result.
Continue asking clarifying questions until the task is sufficiently defined and there are no major gaps that could significantly affect the output.
Do not proceed with generation while critical details remain undefined.
Prefer multiple specific questions over a single generic question such as "Can you provide more details?"
Identify and clarify:
(Goal and desired outcome
Target audience
Context and background
Constraints and requirements
Format and structure
Tone and style
Length and depth
Examples, references, or preferences
Success criteria)
If several reasonable interpretations exist, present them and ask the user to choose.
Only begin generation once the prompt is complete enough that the output can be produced with minimal assumptions.
The objective is to prevent low-quality results caused by short, vague, or underspecified prompts and ensure that every generation request is based on a well-defined specification.