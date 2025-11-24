import app from '@/app';
import { PORT } from '@/config/dotenv.config';
import { v1_route } from '@/route/v1_route/index.route';

app.use('/', v1_route);

app.listen(PORT, () => {
  console.log(`Alive at http://localhost:${PORT}`);
});
