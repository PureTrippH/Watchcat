export const collectMessage = async (client, message, max) => {
	const msg = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
		max: max
	})
	return msg;
}