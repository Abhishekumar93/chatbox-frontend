import { Card, Placeholder } from 'react-bootstrap';

const ShimmerCard = () => {
  return (
    <Card style={{ width: '12rem' }} className="mb-5 border-0 bg-transparent">
      <Card.Body className="p-0 d-flex">
        <Placeholder as="div" xs={3} animation="wave">
          <div
            className="rounded-circle bg-secondary"
            style={{ width: '40px', height: '40px' }}
          />
        </Placeholder>
        <Placeholder as="div" xs={9} animation="wave">
          <Placeholder
            as={Card.Title}
            animation="wave"
            style={{ height: '15px' }}
          >
            <Placeholder xs={12} />
          </Placeholder>
          <Placeholder
            as={Card.Text}
            animation="wave"
            style={{ height: '14px' }}
          >
            <Placeholder xs={6} />
          </Placeholder>
        </Placeholder>
      </Card.Body>
    </Card>
  );
};

export default ShimmerCard;
