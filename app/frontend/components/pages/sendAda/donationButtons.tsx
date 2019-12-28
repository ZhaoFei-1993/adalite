import {h, Component} from 'preact'
import {connect} from '../../../helpers/connect'
import actions from '../../../actions'
import {AdaIcon} from '../../common/svg'
import {ADALITE_CONFIG} from '../../../config'
import {toCoins, toAda} from '../../../helpers/adaConverters'
import tooltip from '../../common/tooltip'
import CustomDonationInput from './customDonationInput'
const {ADALITE_FIXED_DONATION_VALUE} = ADALITE_CONFIG

interface Props {
  maxDonationAmount: number
  checkedDonationType: any
  resetDonation: () => void
  updateDonation: any
  sendAmount: number
  sendAmountValidationError: string
  toggleCustomDonation: any
  percentageDonationValue: any
  percentageDonationText: string
  thresholdAmountReached: any
}

class DonationButtons extends Component<Props> {
  constructor(props) {
    super(props)
    this.getButtonClass = this.getButtonClass.bind(this)
    this.isInsufficient = this.isInsufficient.bind(this)
  }

  getButtonClass(donationAmount, type) {
    if (donationAmount > this.props.maxDonationAmount) {
      return 'button donate insufficient'
    }
    return this.props.checkedDonationType === type ? 'button donate active' : 'button donate'
  }

  isInsufficient(donationAmount, type) {
    if (donationAmount <= this.props.maxDonationAmount) {
      return false
    }
    if (this.props.checkedDonationType === type) {
      /* Rant(ppershing): why do we do side-effects in render? */
      this.props.resetDonation()
    }
    return true
  }

  render({
    disabled,
    updateDonation,
    sendAmount,
    sendAmountValidationError,
    toggleCustomDonation,
    percentageDonationValue,
    percentageDonationText,
    thresholdAmountReached,
  }: any) {
    const isFormValid = !disabled && sendAmount && !sendAmountValidationError
    const isFixedInsufficient = this.isInsufficient(ADALITE_FIXED_DONATION_VALUE, 'fixed')
    const isPercentageInsufficient = this.isInsufficient(percentageDonationValue, 'percentage')
    return (
      <div className="send-donate">
        <button
          id="fixed"
          className={this.getButtonClass(ADALITE_FIXED_DONATION_VALUE, 'fixed')}
          value={ADALITE_FIXED_DONATION_VALUE}
          onClick={updateDonation}
          disabled={!isFormValid || isFixedInsufficient}
          {
          ...{ariaLabel: 'Fixed amount'} /* ignore ts error */
          }
          {...tooltip('Insufficient funds', isFixedInsufficient)}
        >
          {`${ADALITE_FIXED_DONATION_VALUE} `}
          <AdaIcon />
        </button>
        <button
          id="percentage"
          className={this.getButtonClass(percentageDonationValue, 'percentage')}
          value={percentageDonationValue}
          onClick={updateDonation}
          disabled={!isFormValid || !thresholdAmountReached || isPercentageInsufficient}
          {
          ...{ariaLabel: 'Percentage amount'} /* ignore ts error */
          }
          {...tooltip('Insufficient funds', isPercentageInsufficient)}
        >
          {`${percentageDonationText} (`}
          {`${percentageDonationValue} `}
          <AdaIcon />)
        </button>
        <button
          className="button donate"
          id="custom"
          onClick={toggleCustomDonation}
          disabled={!isFormValid}
        >
          Custom
        </button>
      </div>
    )
  }
}

export default connect(
  (state) => ({
    sendAmount: state.sendAmount.fieldValue,
    sendAmountValidationError: state.sendAmountValidationError,
    checkedDonationType: state.checkedDonationType,
    percentageDonationValue: state.percentageDonationValue,
    percentageDonationText: state.percentageDonationText,
    thresholdAmountReached: state.thresholdAmountReached,
    maxDonationAmount: Math.floor(toAda(state.maxDonationAmount)),
    showCustomDonationInput: state.showCustomDonationInput,
    donationAmount: state.donationAmount,
  }),
  actions
)(
  (props: Props & {disabled: any, showCustomDonationInput: any}) =>
    props.showCustomDonationInput ? (
      <CustomDonationInput disabled={props.disabled} />
    ) : (
      <DonationButtons {...{...props}} />
    )
)
