# BabyCare Companion — Final v1.0 Product Plan

## Product goal

BabyCare Companion v1.0 will be a focused baby-care tracker that helps parents answer three questions quickly:

1. What needs attention now?
2. What happened today?
3. Where can I find past records?

The v1.0 information architecture is frozen to avoid repeated navigation redesign during implementation.

## Final navigation

The app will use five bottom-navigation items:

- Home
- Timeline
- Add
- Records
- Profile

### Home

Home is an attention-first dashboard, not a second module menu.

It will show:

- Baby greeting and age
- Next action
- Today's schedule
- Quick Add actions
- Progress summary
- Upcoming reminders
- Latest growth

Home must not duplicate Records or Profile navigation.

### Timeline

Timeline will combine recorded and scheduled activities in chronological order.

Initial filters:

- All
- Feeding
- Sleep
- Medication
- Growth
- Vaccination

A lightweight shared UI model will be used for v1.0 instead of a new universal event database table.

```ts
interface TimelineItem {
    id: string;
    type: 'feeding' | 'sleep' | 'growth' | 'medication' | 'vaccination';
    title: string;
    subtitle?: string;
    timestamp: string;
    status?: string;
}
```
