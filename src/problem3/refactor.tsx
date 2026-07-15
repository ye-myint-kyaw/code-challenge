interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // add missing blockchain property
}

interface FormattedWalletBalance extends WalletBalance {
  // as properties are duplicaetd, I extends WalletBalance to avoid duplication
  formatted: string;
}


// Blockchain priority mapping
const BLOCKCHAIN_PRIORITY: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

// Change the switch statement to a lookup table for better performance and maintainability
const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITY[blockchain] ?? -99;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = ({ ...rest }: Props) => {// spread the rest of props
  const balances = useWalletBalances();
  const prices = usePrices();


  // combined the sorting and formatting into single useMemo
  const formattedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      // Fix incorrect logic (balance.amount<=0) and make simpler 
      return balancePriority > -99 && balance.amount > 0;
    })
      .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain)) // replace the sorting more similar
      .map((balance: WalletBalance) => {
        return {
          ...balance,
          formatted: balance.amount.toFixed()
        }
      })

  }, [balances])

  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
    // add fallback value to prices[balance.currency] to avoid NaN
    const usdValue = (prices[balance.currency] ?? 0) * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={`${balance.blockchain}-${balance.currency}`} //instead of using index, used a stable and unique by combing blockchain and currency key:
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}

// export component
export default WalletPage;