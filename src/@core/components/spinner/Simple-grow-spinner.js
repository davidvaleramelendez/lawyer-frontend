// ** Reactstrap Imports
import {
    Spinner
} from 'reactstrap'

// Constant
import {
    loaderColor
} from '@constant/defaultValues'

const SimpleSpinner = ({
    color = "secondary",
    className = ""
}) => {
    return (
        <div
            className={`${className || "d-flex justify-content-center position-absolute top-50 w-100 zindex-1"}`}
        >
            <Spinner
                type="grow"
                color={color || loaderColor}
            />
        </div>
    )
}

export default SimpleSpinner
