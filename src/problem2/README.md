# 99Tech Currency Swap

This is my solution for the currency swap form take-home project. I built it as a small React + TypeScript app with two tabs inside one card:

- `Swap`: the main form where users convert one token amount into another token.
- `Rates`: a simple view where users can compare exchange rates between a base currency and other quote currencies.


## Why I Built It This Way

The task asks for a currency swap form, so I focused on the main user flow first:

1. User enters an amount.
2. User selects a token to pay with.
3. User selects a token to receive.
4. App calculates the estimated receive amount.
5. User submits and sees a mocked confirmation.

## Design Decisions and Theme

I created two simple views: a swap view and a rates view. Users can make a swap in one tab and compare rates in another tab.

I chose a purple dark theme because the prompt mentioned referencing `99tech.co`, and 99Tech's visual direction feels bold, modern, and tech-focused. Purple is used as the main accent color because it matches that brand feeling better than a plain finance blue or green.

The app also includes a light theme because the task specifically asks for dark/light theme support. I used CSS variables so both themes can share the same layout and components while only changing colors.

## Main Features

- Fetches token prices from `https://interview.switcheo.com/prices.json`
- Uses token icons from the Switcheo token icon repository
- Removes invalid prices and duplicate currencies, then keeps the newest valid price
- Calculates the estimated receive amount from USD-based token prices
- Shows a mocked network fee
- Validates the amount with `react-hook-form`
- Prevents random text from staying in the amount input
- Prevents swapping the same token
- Shows loading and error states
- Shows a mocked success receipt after submit
- Supports dark and light themes
- Uses semantic table markup for the rates view
- Responsive layout for desktop and mobile

## Project Structure

```text
src/
  components/
    ErrorState.tsx
    Header.tsx
    LoadingState.tsx
    RatesTab.tsx
    SwapTab.tsx
    TokenSelect.tsx
    Toolbar.tsx
  hooks/
    useTheme.ts
    useTokens.ts
  services/
    tokenService.ts
  utils/
    formatters.ts
  App.tsx
  index.css
  main.tsx
  types.ts
```

I separated files by responsibility:

- `App.tsx` connects the main pieces together.
- `SwapTab.tsx` contains the swap form and swap calculation.
- `RatesTab.tsx` contains the rates table.
- `TokenSelect.tsx` is shared by both tabs.
- `useTokens.ts` handles fetching token data.
- `useTheme.ts` handles dark/light theme persistence.
- `tokenService.ts` handles price data cleanup.
- `formatters.ts` keeps number formatting consistent.

## Data Cleanup

The token API can contain duplicate currencies or invalid prices. In `tokenService.ts`, I:

- Ignore records without a currency symbol
- Ignore prices that are missing, invalid, or less than or equal to zero
- Keep only one record per currency
- Prefer the newest record when duplicates exist

This makes the UI safer because the swap form only receives usable token data.

## Mock Backend Interaction

There is no real wallet, blockchain, or backend transaction. When the user clicks `Swap now`, the app shows a loading state for a short delay and then displays a success receipt.

I did this because the task says a mocked backend interaction is enough.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS v4
- react-hook-form
- lucide-react
- CSS custom properties for theme colors

## Run The Project

```bash
npm install
npm run dev
```
