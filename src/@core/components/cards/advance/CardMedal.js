// ** Reactstrap Imports
import { Link } from 'react-router-dom'
import {
  Card,
  Button,
  CardBody,
  CardText,
  CardTitle
} from 'reactstrap'

// Constant
import {
  adminRoot
} from '@constant/defaultValues'

const CardMedal = ({
  t,
  userName,
  caseCount
}) => {
  return (
    <Card className="card-congratulations-medal">
      <CardBody className="text-center">
        <h5>{t("Hello")} {userName}!</h5>
        <CardText className="font-small-10">{t("You have")}</CardText>
        <h3 className="mb-75 mt-2 pt-50">
          <a href="/" onClick={e => e.preventDefault()}>
            {caseCount || 0} {t("Open cases")}
          </a>
        </h3>

        <Button
          tag={Link}
          to={`${adminRoot}/case`}
          color="primary"
        >
          {t("View all cases")}
        </Button>
      </CardBody>
    </Card>
  )
}

export default CardMedal
