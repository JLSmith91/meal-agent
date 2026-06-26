import { useState } from "react";

const COLORS = {
  bg: "#0d1117",
  surface: "#161b22",
  surface2: "#1c2333",
  border: "#2d3748",
  accent: "#c8a96e",
  accentDim: "#8a7040",
  green: "#3fb950",
  red: "#f87171",
  yellow: "#fbbf24",
  blue: "#60a5fa",
  muted: "#484f58",
  text: "#e6edf3",
  textDim: "#8b949e",
};

const DIFFICULTY_COLORS = {
  Easy: COLORS.green,
  Medium: COLORS.yellow,
  Hard: COLORS.red,
};

export default function MealAgent() {
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  async function findRecipes() {
    if (!ingredients.trim()) return;
    setLoading(true);
    setError(null);
    setRecipes(null);

    const prompt = `You are a creative chef assistant. The user has these ingredients available:

${ingredients}

Generate recipes in this exact JSON format (no markdown, no explanation):
{
  "canMakeNow": [
    {
      "id": "1",
      "name": "Recipe Name",
      "description": "One sentence description of the dish.",
      "cookTime": "25 mins",
      "difficulty": "Easy",
      "servings": 2,
      "ingredients": ["ingredient 1", "ingredient 2"],
      "steps": ["Step 1 instruction.", "Step 2 instruction.", "Step 3 instruction."]
    }
  ],
  "withFewExtras": [
    {
      "id": "6",
      "name": "Recipe Name",
      "description": "One sentence description of the dish.",
      "cookTime": "30 mins",
      "difficulty": "Medium",
      "servings": 2,
      "ingredients": ["ingredient 1", "ingredient 2"],
      "missingIngredients": ["item to buy 1", "item to buy 2"],
      "steps": ["Step 1 instruction.", "Step 2 instruction.", "Step 3 instruction."]
    }
  ]
}

Rules:
- canMakeNow: 3-5 recipes using ONLY the provided ingredients (plus basic pantry staples like salt, pepper, oil, water)
- withFewExtras: exactly 2 recipes that need 2-4 additional ingredients to buy
- difficulty must be exactly: Easy, Medium, or Hard
- steps should be 4-6 clear cooking instructions
- Make the recipes genuinely good and varied — different cuisines, styles, and complexity levels
- Return only the JSON object`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "API error");

      const fullText = data.content
        .map((i) => (i.type === "text" ? i.text : ""))
        .join("\n");

      const clean = fullText.replace(/```json|```/g, "").trim();
      const start = clean.indexOf("{");
      const end = clean.lastIndexOf("}");
      if (start === -1) throw new Error("No recipes found in response");

      let jsonStr = clean.slice(start, end + 1);
      jsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1");
      const parsed = JSON.parse(jsonStr);
      setRecipes(parsed);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d1117; }
        textarea { resize: vertical; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", background: COLORS.surface }}>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "16px", color: COLORS.text, letterSpacing: "-0.02em" }}>
          🍳 Meal <span style={{ color: COLORS.accent }}>Agent</span>
        </div>
        <div style={{ fontSize: "12px", color: COLORS.muted }}>Tell me what's in your fridge</div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 32px" }}>

        {/* Input */}
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "28px", marginBottom: "32px" }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: COLORS.text, marginBottom: "8px", letterSpacing: "-0.02em" }}>
            What's in your fridge?
          </div>
          <div style={{ fontSize: "13px", color: COLORS.textDim, marginBottom: "20px", lineHeight: "1.6" }}>
            List your ingredients separated by commas. Include anything you have — fridge, freezer, pantry. The more you list, the better the recipes.
          </div>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g. chicken breast, garlic, onion, pasta, canned tomatoes, parmesan, eggs, butter, lemon, spinach..."
            style={{
              width: "100%",
              minHeight: "100px",
              background: COLORS.surface2,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text,
              padding: "14px 16px",
              fontSize: "14px",
              borderRadius: "8px",
              fontFamily: "'Inter', sans-serif",
              lineHeight: "1.6",
              marginBottom: "16px",
            }}
          />
          <button
            onClick={findRecipes}
            disabled={loading || !ingredients.trim()}
            style={{
              padding: "12px 32px",
              background: loading || !ingredients.trim() ? COLORS.surface2 : COLORS.accent,
              color: loading || !ingredients.trim() ? COLORS.muted : COLORS.bg,
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading || !ingredients.trim() ? "default" : "pointer",
              fontFamily: "'Inter', sans-serif",
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Finding recipes..." : "Find Recipes"}
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.accentDim, fontSize: "13px", letterSpacing: "0.1em", animation: "pulse 1.5s ease-in-out infinite" }}>
            Searching for the best recipes with your ingredients...
          </div>
        )}

        {error && (
          <div style={{ background: "rgba(248,113,113,0.08)", border: `1px solid rgba(248,113,113,0.3)`, borderRadius: "8px", padding: "16px", color: COLORS.red, fontSize: "13px" }}>
            {error}
          </div>
        )}

        {recipes && (
          <>
            {/* Can Make Now */}
            <div style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: COLORS.green, letterSpacing: "0.12em", textTransform: "uppercase" }}>✓ Ready to Cook</div>
                <div style={{ height: "1px", flex: 1, background: COLORS.border }} />
                <div style={{ fontSize: "11px", color: COLORS.muted }}>{recipes.canMakeNow?.length} recipes</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {recipes.canMakeNow?.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    type="now"
                    expanded={expanded === recipe.id}
                    onToggle={() => setExpanded(expanded === recipe.id ? null : recipe.id)}
                  />
                ))}
              </div>
            </div>

            {/* With Few Extras */}
            {recipes.withFewExtras?.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: COLORS.blue, letterSpacing: "0.12em", textTransform: "uppercase" }}>+ A Few Extras Needed</div>
                  <div style={{ height: "1px", flex: 1, background: COLORS.border }} />
                  <div style={{ fontSize: "11px", color: COLORS.muted }}>{recipes.withFewExtras?.length} recipes</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {recipes.withFewExtras?.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      type="extras"
                      expanded={expanded === recipe.id}
                      onToggle={() => setExpanded(expanded === recipe.id ? null : recipe.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!loading && !recipes && !error && (
          <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.muted, fontSize: "13px" }}>
            Enter your ingredients above to get started.
          </div>
        )}
      </div>
    </div>
  );
}

function RecipeCard({ recipe, type, expanded, onToggle }) {
  const borderColor = type === "now" ? COLORS.green : COLORS.blue;
  const diffColor = DIFFICULTY_COLORS[recipe.difficulty] || COLORS.textDim;

  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "10px", borderLeft: `3px solid ${borderColor}`, overflow: "hidden" }}>
      <div style={{ padding: "20px 24px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }} onClick={onToggle}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px", fontWeight: 700, color: COLORS.text, marginBottom: "6px", letterSpacing: "-0.01em" }}>{recipe.name}</div>
          <div style={{ fontSize: "13px", color: COLORS.textDim, marginBottom: "12px", lineHeight: "1.5" }}>{recipe.description}</div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: COLORS.textDim }}>⏱ {recipe.cookTime}</span>
            <span style={{ fontSize: "12px", color: diffColor }}>● {recipe.difficulty}</span>
            <span style={{ fontSize: "12px", color: COLORS.textDim }}>👤 {recipe.servings} servings</span>
          </div>
          {type === "extras" && recipe.missingIngredients?.length > 0 && (
            <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {recipe.missingIngredients.map((item, i) => (
                <span key={i} style={{ fontSize: "11px", padding: "3px 10px", background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", color: COLORS.blue, borderRadius: "20px" }}>
                  + {item}
                </span>
              ))}
            </div>
          )}
        </div>
        <div style={{ color: COLORS.muted, fontSize: "18px", flexShrink: 0 }}>{expanded ? "↑" : "↓"}</div>
      </div>

      {expanded && (
        <div style={{ padding: "0 24px 24px", borderTop: `1px solid ${COLORS.border}`, paddingTop: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: COLORS.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Ingredients</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
                {recipe.ingredients?.map((ing, i) => (
                  <li key={i} style={{ fontSize: "13px", color: COLORS.textDim, display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <span style={{ color: COLORS.accentDim, flexShrink: 0 }}>—</span> {ing}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: COLORS.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Instructions</div>
              <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                {recipe.steps?.map((step, i) => (
                  <li key={i} style={{ fontSize: "13px", color: COLORS.textDim, display: "flex", gap: "10px", lineHeight: "1.6" }}>
                    <span style={{ color: COLORS.accent, fontWeight: 600, flexShrink: 0, fontSize: "12px", marginTop: "2px" }}>{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}