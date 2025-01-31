import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassowrd] = useState('');
  const url = '/api/users/signin';
  const { doRequest, errors } = useRequest({
    url: url,
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/'),
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    doRequest();
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassowrd(e.target.value)}
          autoComplete="new-password"
        />
      </div>
      {errors}
      <button className="btn btn-primary">Sign In</button>
    </form>
  );
};
