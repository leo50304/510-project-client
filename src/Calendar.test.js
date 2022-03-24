import { render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import '@testing-library/jest-dom'

import Calendar from './Calendar'

const server = setupServer(
  rest.get('/getMeetingSetting', (req, res, ctx) => {
    return res(ctx.json({
      timerange: [
        '2022-03-16T00:00:00.000-04:00',
        '2022-03-24T00:00:00.000-04:00'],
      available: true,
      hostslots: ['2022-03-16T10:30:00.000Z'], 
      }
    ))
  }),
  rest.get('/getUserSave', (req, res, ctx) => {
    return res(ctx.json([
      '2022-03-16T10:30:00.000Z'
    ]))
  }),
  rest.post('/submit', (req, res, ctx) => {
    return res(ctx.json({status:"Success"}))
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('Renders normally', () => {
  render(<Calendar />);
  const linkElement = screen.getByText(/My Calendar/);
  expect(linkElement).toBeInTheDocument();
});


it("Submit timeslots", async () => {
  render(<Calendar />);
  userEvent.click(screen.getByText(/Submit/))
  await waitFor(() => screen.getByText(/Saved/))
  const linkElement = screen.getByText(/Saved/)
  expect(linkElement).toBeInTheDocument();
});

it("Click on the Can't Meet Button", async () => {
  render(<Calendar />);
  userEvent.click(screen.getByText(/Can't Meet/))
  await waitFor(() => screen.getByText(/Notified/))
  const linkElement = screen.getByText(/Notified/)
  expect(linkElement).toBeInTheDocument();
});