import React from 'react';
import { Button } from 'react-bootstrap';

export function Pagination(props) {
    return <div className="mb-3">
    <span className="float-right">Total: {props.count} item{props.count !== 1 ? 's': ''}</span>
    {props.previous &&
      <Button variant="secondary"
        onClick={() => props.fetch(props.previous)}
        size="sm" className="mr-2">« Previous</Button>
    }
    {props.next &&
      <Button variant="secondary"
        onClick={() => props.fetch(props.next)}
        size="sm" className="mr-2">Next »</Button>
    }
  </div>
}