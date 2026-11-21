import EmojiEmotionsOutlined from "@mui/icons-material/EmojiEmotionsOutlined";
import { Card, CardContent, Chip, Skeleton, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getJokeOfTheDayOptions } from "@apis/backend";

/**
 * Joke of the day: a read-only query. The API caches it until midnight, so the front keeps it for an hour.
 * Its failures (502 when the provider is down) are shown here instead of a toast.
 */
export function JokeOfTheDay() {
	const joke = useQuery({ ...getJokeOfTheDayOptions(), staleTime: 60 * 60 * 1000, retry: false, meta: { silent: true } });

	return (
		<Card elevation={0} sx={{ mb: { xs: 2, md: 2.5 } }}>
			<CardContent>
				<Stack direction={"row"} spacing={1} sx={{ alignItems: "center", mb: 1 }}>
					<EmojiEmotionsOutlined color={"secondary"} fontSize={"small"} />
					<Typography variant={"overline"}>Joke of the day</Typography>
					{joke.data && <Chip size={"small"} variant={"outlined"} label={joke.data.category} />}
				</Stack>

				{joke.isPending && (
					<>
						<Skeleton width={"60%"} />
						<Skeleton width={"40%"} />
					</>
				)}

				{joke.isError && <Typography sx={{ color: "text.secondary" }}>No joke today: the provider is not answering, come back later.</Typography>}

				{joke.data && (
					<>
						<Typography variant={"h6"}>{joke.data.text}</Typography>
						{joke.data.punchline && <Typography sx={{ color: "text.secondary", mt: 0.5 }}>{joke.data.punchline}</Typography>}
					</>
				)}
			</CardContent>
		</Card>
	);
}
