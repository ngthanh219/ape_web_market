import Login from "../components/pages/auth/Login";
import Home from "../components/Home";
import ToolBoxMarket from "../components/pages/tool-box-market/ToolBoxMarket";
import NotFoundV1 from "../components/pages/not-found/NotFoundV1";

const routes = [
    {
        path: '/',
        redirect: '/toolbox-market',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/login',
                name: 'Login',
                component: Login,
            },
            {
                path: '/logout',
                name: 'Logout',
                component: Login,
            },
            {
                path: '/toolbox-market',
                name: 'ToolBoxMarket',
                component: ToolBoxMarket,
            },
            {
                path: '*',
                component: NotFoundV1
            }
        ]
    }
]

export default routes;
