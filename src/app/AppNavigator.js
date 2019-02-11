import { DrawerNavigator } from 'react-navigation';

import CreateWalletContainer from '../features/wallet/containers/CreateWalletContainer';
import SelectActiveWalletContainer from '../features/wallet/containers/SelectActiveWalletContainer';
import SendTransactionContainer from '../features/wallet/containers/SendTransactionContainer';
import GenerateAddressContainer from '../features/wallet/containers/GenerateAddressContainer';
import AddressesContainer from '../features/wallet/containers/AddressesContainer';
import TransactionsContainer from '../features/wallet/containers/TransactionsContainer';
import ExportWalletContainer from '../features/wallet/containers/ExportWalletContainer';
import ImportWalletContainer from '../features/wallet/containers/ImportWalletContainer';
import WalletInfoContainer from '../features/wallet/containers/WalletInfoContainer';

export default DrawerNavigator({
  SelectActiveWallet: { screen: SelectActiveWalletContainer },
  CreateWallet: { screen: CreateWalletContainer },
  SendTransaction: { screen: SendTransactionContainer },
  GenerateAddress: { screen: GenerateAddressContainer },
  Addresses: { screen: AddressesContainer },
  Transactions: { screen: TransactionsContainer },
  ExportWallet: { screen: ExportWalletContainer },
  ImportWallet: { screen: ImportWalletContainer },
  WalletInfo: { screen: WalletInfoContainer },
});
