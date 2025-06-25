import { Bell, CreditCard, LayoutDashboard, Settings, UserRound } from "lucide-react";

const NAV_ITEMS = [
    { label: 'Home', route: '/' },
    { label: 'Analytics', route: '/analytics' },
    { label: 'Pricing', route: '/pricing' },
    { label: 'About Us', route: '/about-us' }
]

const PROFILE_ITEMS = [
    { label: 'Profile', route: '/account', icon: <UserRound /> },
    { label: 'Settings', route: '/account/settings', icon: <Settings /> },
    { label: 'Dashboard', route: '/dashboard', icon: <LayoutDashboard /> },
    { label: 'Subscription', route: '/account/subscription', icon: <CreditCard /> },
    { label: 'Notifications', route: '/account/notifications', icon: <Bell />}
]

const QUESTIONS = [
    {
        id: 1,
        question: "What's your monthly allowance?",
        type: "number",
        placeholder: "Enter your monthly allowance"
    },
    {
        id: 2,
        question: "How much percentage of your money do you want to save each month?",
        options: [
            { value: "10", label: "10%" },
            { value: "20", label: "20%" },
            { value: "30", label: "30%" },
            { value: "50", label: "50% or more" }
        ]
    },
    {
        id: 3,
        question: "What do you usually spend your money on?",
        options: [
            { value: "food", label: "Food & snacks" },
            { value: "entertainment", label: "Movies, games, or subscriptions" },
            { value: "shopping", label: "Clothes or gadgets" },
            { value: "travel", label: "Commute or travel" },
            { value: "savings", label: "I try to save most of it" }
        ]
    },
    {
        id: 4,
        question: "Do you usually run out of money before the end of the month?",
        options: [
            { value: "always", label: "Yes, almost always" },
            { value: "sometimes", label: "Sometimes" },
            { value: "rarely", label: "Rarely" },
            { value: "never", label: "Never, I manage well" }
        ]
    }
];

export { NAV_ITEMS, PROFILE_ITEMS, QUESTIONS };