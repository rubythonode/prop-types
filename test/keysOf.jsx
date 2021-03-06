import { expect } from 'chai';
import React, { PropTypes } from 'react';

import { keysOf } from '../';

import callValidator from './_callValidator';

describe('keysOf', () => {
  it('throws when not given a valid propType', () => {
    expect(() => keysOf()).to.throw(TypeError);
    expect(() => keysOf(null)).to.throw(TypeError);
    expect(() => keysOf({})).to.throw(TypeError);
    expect(() => keysOf([])).to.throw(TypeError);
  });

  it('returns a function', () => {
    expect(typeof keysOf(PropTypes.any)).to.equal('function');
  });

  function assertPasses(validator, element, propName) {
    expect(callValidator(validator, element, propName, '"keysOf" test')).to.equal(null);
  }

  function assertFails(validator, element, propName) {
    expect(callValidator(validator, element, propName, '"keysOf" test')).to.be.instanceOf(Error);
  }

  it('passes with an object with no keys', () => {
    assertPasses(
      keysOf(PropTypes.number),
      (<div a={{}} />),
      'a',
    );
  });

  it('passes when keys match the prop type', () => {
    assertPasses(
      keysOf(PropTypes.oneOf(['foo', 'bar'])),
      (<div a={{ foo: 1, bar: 'qoob' }} />),
      'a',
    );
  });

  it('fails when keys do not match the prop type', () => {
    assertFails(
      keysOf(PropTypes.oneOf(['foo', 'bar'])),
      (<div a={{ foo: 1, not_validated: 'qoob' }} />),
      'a',
    );
  });

  it('passes when the prop is not defined', () => {
    assertPasses(
      keysOf(PropTypes.number),
      (<div />),
      'a',
    );
  });

  it('is required with .isRequired', () => {
    assertFails(
      keysOf(PropTypes.number).isRequired,
      (<div />),
      'a',
    );
  });

  it('still passes with .isRequired if props are valid', () => {
    assertPasses(
      keysOf(PropTypes.oneOf(['foo', 'bar'])).isRequired,
      (<div a={{ foo: 1, bar: 'qoob' }} />),
      'a',
    );
  });
});
