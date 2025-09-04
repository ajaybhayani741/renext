const Label = ({ text, colon = true, className }) => {
  return (
    <div className="ant-form-item-label">
      <label className={className}>
        {text} {colon ? ':' : ''}
      </label>
    </div>
  )
}

export default Label
