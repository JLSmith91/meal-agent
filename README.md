# 🍳 Meal Agent

An AI-powered meal planning tool that generates recipes from your available ingredients — plus smart suggestions for dishes that only need a few extra items to buy.

**Live Demo:** [meal-agent-ochre.vercel.app](https://meal-agent-ochre.vercel.app)

---

## What It Does

Enter whatever ingredients you have on hand and the agent generates two sets of recipes:

**Ready to Cook** — 3-5 recipes you can make right now using only what you have, plus basic pantry staples like salt, pepper, and oil.

**A Few Extras Needed** — 2 recipes that only require 2-4 additional ingredients, with the missing items clearly highlighted so you know exactly what to grab at the store.

Each recipe includes:
- Cook time and difficulty level
- Serving size
- Full ingredient list
- Step-by-step cooking instructions
- Missing ingredients highlighted for "extras needed" recipes

---

## Tech Stack

- **React** + **Vite** — frontend framework and build tool
- **Anthropic Claude API** (`claude-sonnet-4-6`) — recipe generation and meal planning
- **Vercel** — deployment and hosting

---

## Getting Started

### Prerequisites
- Node.js v18+
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com))

### Installation

```bash
git clone https://github.com/JLSmith91/meal-agent.git
cd meal-agent
npm install
```

### Environment Variables

Create a `.env` file in the root of the project:

```
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and enter your ingredients.

---

## How to Use

1. Type your available ingredients separated by commas
2. Include anything from your fridge, freezer, or pantry
3. Hit **Find Recipes**
4. Click any recipe card to expand full ingredients and instructions

---

## Deployment

This project is deployed on Vercel. To deploy your own instance:

1. Fork this repo
2. Import it into [vercel.com](https://vercel.com)
3. Add `VITE_ANTHROPIC_API_KEY` as an environment variable
4. Deploy

---

## Part of a Larger AI Tooling Portfolio

Meal Agent is part of a suite of AI-powered tools built for real-world daily use. Other projects include a pre-market trading intelligence agent, an AI job search agent, and a full stack trade journal.

---

## Author

**Jared Smith** — [@JLSmith91](https://github.com/JLSmith91)
