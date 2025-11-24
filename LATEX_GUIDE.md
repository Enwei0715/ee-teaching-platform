# LaTeX Math Syntax Guide for EE Teaching Platform

## ✅ CORRECT Syntax (Use These)

### Inline Math
```markdown
$ E_F = \frac{E_c + E_v}{2} $
$ E_g = E_c - E_v $
```

### Display Math (Block)
```markdown
$$
E_F = \frac{E_c + E_v}{2}
$$

$$
V = IR
$$
```

## ❌ INCORRECT Syntax (Do NOT Use)

### DO NOT Use Parentheses Delimiters
```markdown
\( E_c \)   ❌ WILL CRASH
\[ E_c \]   ❌ WILL CRASH
```

### DO NOT Use Bare Curly Braces
```markdown
{E_c}       ❌ WILL CRASH (MDX thinks it's JavaScript)
```

## Escaping Rules

If you need to show literal curly braces in text (not math), escape them:
```markdown
Use \{ and \} for literal braces
```

## Examples

### Good Example
```markdown
The energy gap is calculated as $ E_g = E_c - E_v $ where:
- $ E_c $ is the conduction band energy
- $ E_v $ is the valence band energy

The Fermi level formula is:

$$
E_F = \frac{E_c + E_v}{2}
$$
```

### Bad Example (Will Crash)
```markdown
The energy gap is \( E_g = E_c - E_v \)  ❌
```
