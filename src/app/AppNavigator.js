import { createDrawerNavigator } from 'react-navigation';

import CreateWalletContainer from '../features/wallet/containers/CreateWalletContainer';
import SelectActiveWalletContainer from '../features/wallet/containers/SelectActiveWalletContainer';
import SendTransactionContainer from '../features/wallet/containers/SendTransactionContainer';
import GenerateAddressContainer from '../features/wallet/containers/GenerateAddressContainer';
import AddressesContainer from '../features/wallet/containers/AddressesContainer';
import TransactionsContainer from '../features/wallet/containers/TransactionsContainer';
import ExportWalletContainer from '../features/wallet/containers/ExportWalletContainer';
import ImportWalletContainer from '../features/wallet/containers/ImportWalletContainer';
import WalletInfoContainer from '../features/wallet/containers/WalletInfoContainer';

export default createDrawerNavigator({
  SelectActiveWallet: SelectActiveWalletContainer,
  CreateWallet: CreateWalletContainer,
  SendTransaction: SendTransactionContainer,
  GenerateAddress: GenerateAddressContainer,
  Addresses: AddressesContainer,
  Transactions: TransactionsContainer,
  ExportWallet: ExportWalletContainer,
  ImportWallet: ImportWalletContainer,
  WalletInfo: WalletInfoContainer,
});
