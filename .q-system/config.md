# Q-System Configuration

**Created:** 2025-12-10T14:25:00Z
**Setup mode:** Completed (partial install fixed)

---

## User Identity

Used for session file naming: `YYYY-MM-DD-HHmm-[name].md`

```
user_name: Brian
```

---

## Project Profile

```
project_type: Software/Code
collaboration: Solo
experience_level: Intermediate
project_name: Peer Loop - Education Marketplace
```

---

## Git Tracking

Control whether session files are tracked in git.

- `yes` - Track session files (useful for solo projects or team documentation)
- `no` - Keep session files local only (default, recommended for most projects)

```
track_in_git: yes
```

If you set this to `yes`, also remove `.q-system/` from your `.gitignore`.

---

## Session Behavior

### Friction Prompt

Ask about capturing learnings at session end?

```
friction_prompt: yes
```

### Auto-checkpoint

Automatically save checkpoint after N minutes of work? (0 = disabled)

```
auto_checkpoint_minutes: 0
```

---

## Notes

- Changes take effect on next `/q-begin`
- Invalid values are ignored (defaults used)
- This file is read by Q-System slash commands
