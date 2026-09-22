import type { Post } from "./data.js";

type FitnessPost = Omit<Post, "id">; // the database chooses the id

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`; // free Unsplash photos

export const fitnessPosts: FitnessPost[] = [
  {
    urlId: "5-compound-lifts-every-beginner-should-learn",
    title: "5 Compound Lifts Every Beginner Should Learn",
    description:
      "Squat, deadlift, bench, row and overhead press. Master these five and you have a full-body program for years.",
    content: `# Why compound lifts?

Compound lifts move **more than one joint at a time**, so you train several muscles in one movement. That makes them the best return on your gym time.

## The big five

1. **Back squat** for legs and core
2. **Deadlift** for your whole back side, from hamstrings to upper back
3. **Bench press** for chest, shoulders and triceps
4. **Barbell row** for your upper back and biceps
5. **Overhead press** for shoulders and core stability

## How to start

Pick a weight you can lift for 8 clean reps. Film your sets, focus on form over load, and add a little weight only when every rep looks the same.`,
    imageUrl: img("photo-1534438327276-14e5300c3a48"),
    date: new Date("Aug 28, 2026"),
    category: "Training",
    tags: "Strength,Beginners",
    views: 412,
    likes: 9,
    active: true,
  },
  {
    urlId: "progressive-overload-the-secret-to-getting-stronger",
    title: "Progressive Overload: The Secret to Getting Stronger",
    description:
      "Your body only adapts when you ask it to do a little more than last time. Here is how to build that into every week.",
    content: `# Do a little more, every time

**Progressive overload** means slowly increasing the demand on your muscles. Without it, your body has no reason to change.

## Ways to progress

- Add a small amount of **weight** (1 to 2.5 kg)
- Add **one more rep** to each set
- Add **one more set** to an exercise
- Slow down the **lowering** part of the lift

## Keep a log

Write down every session. When you can hit the top of your rep range with good form for all sets, it is time to progress. Small steps add up to big results over months.`,
    imageUrl: img("photo-1517836357463-d25dfeac3438"),
    date: new Date("Jul 14, 2026"),
    category: "Training",
    tags: "Strength,Programming",
    views: 288,
    likes: 6,
    active: true,
  },
  {
    urlId: "how-much-protein-do-you-actually-need",
    title: "How Much Protein Do You Actually Need?",
    description:
      "Protein helps your muscles recover and grow. A simple guide to how much to eat and where to get it.",
    content: `# Protein basics

Protein is the building block your muscles use to **repair and grow** after training.

## A common guideline

Many sports nutrition guides suggest around **1.6 g of protein per kg of body weight** each day for people who lift regularly. Everyone is different, so a dietitian can give you advice for your own needs.

## Easy protein sources

- Eggs and Greek yoghurt
- Chicken, fish and lean beef
- Lentils, chickpeas and tofu
- Milk or a protein shake after training

## Spread it out

Aim to include some protein in **every meal**, rather than trying to eat it all at dinner.`,
    imageUrl: img("photo-1490645935967-10de6ba17061"),
    date: new Date("Jun 02, 2026"),
    category: "Nutrition",
    tags: "Protein,Beginners",
    views: 530,
    likes: 12,
    active: true,
  },
  {
    urlId: "meal-prep-sunday-a-week-of-gym-lunches",
    title: "Meal Prep Sunday: A Week of Gym Lunches in 90 Minutes",
    description:
      "One cooking session, five balanced lunches. Save money, save time and stop skipping meals on busy days.",
    content: `# Plan once, eat well all week

Meal prep takes the guesswork out of eating well when life gets busy.

## The formula

Every container gets:

1. A **protein** (chicken thighs, tofu or mince)
2. A **carb** (rice, potatoes or pasta)
3. **Two vegetables** (roasted or steamed)
4. A **sauce** to stop it getting boring

## Tips

- Cook proteins and carbs in big batches at the same time
- Keep sauces separate until you eat
- Most prepped meals keep well in the fridge for **3 to 4 days**, so freeze the rest`,
    imageUrl: img("photo-1512621776951-a57141f2eefd"),
    date: new Date("Mar 22, 2026"),
    category: "Nutrition",
    tags: "Meal Prep,Protein",
    views: 197,
    likes: 4,
    active: true,
  },
  {
    urlId: "rest-days-are-training-days",
    title: "Rest Days Are Training Days",
    description:
      "Muscles grow while you recover, not while you lift. Why sleep and rest days matter as much as your workouts.",
    content: `# Recovery is where progress happens

Training creates small amounts of stress in your muscles. **Rest is when your body repairs** and comes back stronger.

## Sleep first

Most adults need **7 to 9 hours** of sleep. Good sleep supports energy, mood and performance in the gym.

## Active recovery ideas

- A relaxed walk or easy bike ride
- Light stretching or yoga
- Foam rolling tight areas

## Listen to your body

Feeling unusually tired, sore for days, or losing strength can be signs you need more rest.`,
    imageUrl: img("photo-1544367567-0f2fcb009e0b"),
    date: new Date("Jan 18, 2026"),
    category: "Recovery",
    tags: "Sleep,Mobility",
    views: 164,
    likes: 5,
    active: true,
  },
  {
    urlId: "10-minute-mobility-routine-for-desk-workers",
    title: "10-Minute Mobility Routine for Desk Workers",
    description:
      "Sitting all day tightens your hips and upper back. Five simple moves to loosen up before your next session.",
    content: `# Undo the desk posture

Long hours of sitting can leave your **hips, chest and upper back** feeling stiff.

## The routine (2 minutes each)

1. **Cat-cow** on hands and knees
2. **Hip flexor stretch** in a half-kneeling position
3. **Thoracic rotations** lying on your side
4. **Deep squat hold**, holding onto something if needed
5. **Doorway chest stretch**

## When to do it

Try it before training as a warm-up, or on work breaks. Move slowly and never push into pain.`,
    imageUrl: img("photo-1571019613454-1cb2f99b2d8b"),
    date: new Date("Nov 05, 2025"),
    category: "Recovery",
    tags: "Mobility,Beginners",
    views: 243,
    likes: 7,
    active: true,
  },
  {
    urlId: "staying-consistent-when-motivation-runs-out",
    title: "Staying Consistent When Motivation Runs Out",
    description:
      "Motivation comes and goes. Habits and a simple plan keep you showing up on the days you do not feel like it.",
    content: `# Motivation is not the plan

Everyone has days they do not feel like training. **Consistency beats intensity** over the long run.

## Build the habit

- **Schedule** your sessions like appointments
- Pack your gym bag the night before
- Start with a **minimum**: even 20 minutes counts

## Track your wins

Write down lifts, runs or streaks. Looking back at how far you have come is one of the best motivators there is.

## Find your people

Training with a friend or joining a class makes it much harder to skip.`,
    imageUrl: img("photo-1541534741688-6078c6bfb5c5"),
    date: new Date("Sep 10, 2025"),
    category: "Mindset",
    tags: "Habits,Motivation",
    views: 321,
    likes: 8,
    active: true,
  },
];