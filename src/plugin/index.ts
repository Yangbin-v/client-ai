function getWeather({location}: {location: string}) {
    if (!location) {
        return '请输入城市名称';
    }
    return `${location} 的天气信息：天气晴朗，温度20度，湿度50%，风力2级，空气质量优。`;
}

function sendEmail({to, content}: {to: string, content: string}) {
    if (!to) {
        return '请输入收件人邮箱';
    }
    if (!content) {
        return '请输入邮件内容';
    }

    return `邮件发送成功，收件人：${to}，内容：${content}`;
}

function orderTakeout({restaurant, food}: {restaurant: string, food: string}) {
    if (!restaurant) {
        return '请输入餐厅名称';
    }
    if (!food) {
        return '请输入菜品名称';
    }
    return `订单已成功提交，餐厅：${restaurant}，菜品：${food}`;
}

export const pluginMap = {
    getWeather,
    sendEmail,
    orderTakeout,
};
