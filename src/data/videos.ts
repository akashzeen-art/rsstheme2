export interface Video {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  aspect: "portrait" | "landscape";
  videoUrl: string;
}

const CDN = "https://vz-012bcd01-e4e.b-cdn.net";

export const trendingVideos: Video[] = [
  { id: "t1",  title: "Raaz Beyond Fear",          category: "Thriller", aspect: "landscape", thumbnail: "/landscape/1.png",  videoUrl: `${CDN}/a6835e5b-88a3-4c2a-8e9e-972a8e46588c/play_480p.mp4` },
  { id: "t2",  title: "The Hidden Truth",           category: "Thriller", aspect: "landscape", thumbnail: "/landscape/2.png",  videoUrl: `${CDN}/803b1a1b-4b7a-4376-ae00-118c611ad37d/play_480p.mp4` },
  { id: "t3",  title: "Silent Chase",               category: "Action",   aspect: "landscape", thumbnail: "/landscape/3.png",  videoUrl: `${CDN}/e7654d3b-fef4-4867-8426-e8deabada55b/play_480p.mp4` },
  { id: "t4",  title: "The Missing Witness",        category: "Mystery",  aspect: "landscape", thumbnail: "/landscape/4.png",  videoUrl: `${CDN}/9b9b7858-2935-4a71-8554-cb6aa69eefdc/play_480p.mp4` },
  { id: "t5",  title: "The Secret Route Ep 1",      category: "Drama",    aspect: "landscape", thumbnail: "/landscape/5.png",  videoUrl: `${CDN}/3ff5f869-4419-444b-a338-870703a42f6c/play_480p.mp4` },
  { id: "t6",  title: "The Secret Route Ep 2",      category: "Drama",    aspect: "landscape", thumbnail: "/landscape/6.png",  videoUrl: `${CDN}/e0608c54-d8e5-4bfb-b354-4ee545847c3e/play_480p.mp4` },
  { id: "t7",  title: "Raaz, Revenge & Mafia Ep1",  category: "Crime",    aspect: "landscape", thumbnail: "/landscape/7.png",  videoUrl: `${CDN}/ee0edf68-632d-4613-97cb-5dfccbcf327f/play_480p.mp4` },
  { id: "t8",  title: "Raaz, Revenge & Mafia Ep2",  category: "Crime",    aspect: "landscape", thumbnail: "/landscape/8.png",  videoUrl: `${CDN}/6404e890-3e18-4cab-95f7-3ae76fc0aeb8/play_480p.mp4` },
  { id: "t9",  title: "Silent Trigger",             category: "Action",   aspect: "landscape", thumbnail: "/landscape/9.png",  videoUrl: `${CDN}/204461ac-ae3c-4d31-a393-ed37c9a2ae91/play_480p.mp4` },
  { id: "t10", title: "The Forbidden Files",        category: "Mystery",  aspect: "landscape", thumbnail: "/landscape/10.png", videoUrl: `${CDN}/85f84324-4088-4cc8-8ea2-ca99cb7bc568/play_480p.mp4` },
];

export const fatalConnectionsVideos: Video[] = [
  { id: "v11", title: "FATAL CONNECTIONS EP1", category: "Thriller", aspect: "landscape", thumbnail: "/landscape/11.png", videoUrl: `${CDN}/2599bc17-5da5-4ebe-88c6-4e388cfb6e7a/play_480p.mp4` },
  { id: "v12", title: "FATAL CONNECTIONS EP2", category: "Thriller", aspect: "landscape", thumbnail: "/landscape/12.png", videoUrl: `${CDN}/fc291be4-3392-44be-aef8-d4d056051f1f/play_480p.mp4` },
  { id: "v13", title: "FATAL CONNECTIONS EP3", category: "Thriller", aspect: "landscape", thumbnail: "/landscape/13.png", videoUrl: `${CDN}/fa05d0b5-a766-4810-b989-a796daf5082e/play_480p.mp4` },
  { id: "v14", title: "THE HIDDEN ENEMY",      category: "Thriller", aspect: "landscape", thumbnail: "/landscape/14.png", videoUrl: `${CDN}/47557aed-0f85-45cf-a818-19fd88a2b8de/play_480p.mp4` },
  { id: "v15", title: "ESCAPE FROM NOWHERE",   category: "Action",   aspect: "landscape", thumbnail: "/landscape/15.png", videoUrl: `${CDN}/80d10199-16c3-433f-8802-de52a258588c/play_480p.mp4` },
  { id: "v16", title: "THE FINAL SECRET",      category: "Mystery",  aspect: "landscape", thumbnail: "/landscape/16.png", videoUrl: `${CDN}/3ed4455a-3408-42e9-bf9a-5f45d616ad76/play_480p.mp4` },
  { id: "v17", title: "THE SECRET ORDER",      category: "Thriller", aspect: "landscape", thumbnail: "/landscape/17.png", videoUrl: `${CDN}/d6698497-d9a5-49ca-aae7-a937f0a563bc/play_480p.mp4` },
  { id: "v18", title: "THE FINAL DHOKHA",      category: "Drama",    aspect: "landscape", thumbnail: "/landscape/18.png", videoUrl: `${CDN}/ed0bce30-6b78-4d14-8c40-e5971b4f3b8d/play_480p.mp4` },
  { id: "v19", title: "BLACK DIARY SECRETS EP1", category: "Mystery", aspect: "landscape", thumbnail: "/landscape/19.png", videoUrl: `${CDN}/62b9d1e4-4a58-440d-aced-b23367687127/play_480p.mp4` },
  { id: "v20", title: "BLACK DIARY SECRETS EP2", category: "Mystery", aspect: "landscape", thumbnail: "/landscape/20.png", videoUrl: `${CDN}/34f1001c-5f45-4a80-8a76-a2bee40bb09a/play_480p.mp4` },
];

export const missionVideos: Video[] = [
  { id: "v21", title: "FINAL WITNESS",        category: "Thriller", aspect: "portrait", thumbnail: "/portrait/21.png", videoUrl: `${CDN}/c3dd489e-3c1b-4446-9366-4f83581a404a/play_480p.mp4` },
  { id: "v22", title: "THE MISSING LINK",     category: "Mystery",  aspect: "portrait", thumbnail: "/portrait/22.png", videoUrl: `${CDN}/11444673-b5cf-43a1-a6fa-7cc8e4552e96/play_480p.mp4` },
  { id: "v23", title: "DEAD END MISSON",      category: "Action",   aspect: "portrait", thumbnail: "/portrait/23.png", videoUrl: `${CDN}/02966cfc-7e24-429d-9d2b-56864dfe368e/play_480p.mp4` },
  { id: "v24", title: "DANGEROUS ALLIANCE",   category: "Thriller", aspect: "portrait", thumbnail: "/portrait/24.png", videoUrl: `${CDN}/84b04739-d8f4-4a60-9a0c-1956fc0c562d/play_480p.mp4` },
  { id: "v25", title: "ESCAPE PLAN 302",      category: "Action",   aspect: "portrait", thumbnail: "/portrait/25.png", videoUrl: `${CDN}/0b2b1dcd-98bd-46c2-a427-cb94c626ef50/play_480p.mp4` },
  { id: "v26", title: "ROGUE MISSON",         category: "Action",   aspect: "portrait", thumbnail: "/portrait/26.png", videoUrl: `${CDN}/bc22fa81-0406-4f0a-bdf1-a5a928abdcec/play_480p.mp4` },
  { id: "v27", title: "OPERATION NIGHTFALL",  category: "Thriller", aspect: "portrait", thumbnail: "/portrait/27.png", videoUrl: `${CDN}/28d84155-2e99-4633-833d-01bfb7187dd3/play_480p.mp4` },
  { id: "v28", title: "DANGEROUS MINDS EP1",  category: "Drama",    aspect: "portrait", thumbnail: "/portrait/28.png", videoUrl: `${CDN}/95ed5ede-0819-414c-8e3e-7bcaba0eb881/play_480p.mp4` },
  { id: "v29", title: "DANGEROUS MINDS EP2",  category: "Drama",    aspect: "portrait", thumbnail: "/portrait/29.png", videoUrl: `${CDN}/ac231f13-5e7b-40fb-af8e-97be64977c56/play_480p.mp4` },
  { id: "v30", title: "DANGEROUS MINDS EP3",  category: "Drama",    aspect: "portrait", thumbnail: "/portrait/30.png", videoUrl: `${CDN}/55c72f41-bd2a-4a41-b9a2-a171aefd7015/play_480p.mp4` },
];

export const dangerousMindsVideos: Video[] = [
  { id: "v31", title: "DANGEROUS MINDS EP4",  category: "Drama",    aspect: "landscape", thumbnail: "/landscape/31.png", videoUrl: `${CDN}/fb60c689-0ae6-4d37-9e7a-0a6fd490aef0/play_480p.mp4` },
  { id: "v32", title: "BEYOND SUSPICION EP1", category: "Thriller", aspect: "landscape", thumbnail: "/landscape/32.png", videoUrl: `${CDN}/1a4d0e65-a4a4-4468-99f6-51d2e3754ded/play_480p.mp4` },
  { id: "v33", title: "BEYOND SUSPICION EP2", category: "Thriller", aspect: "landscape", thumbnail: "/landscape/33.png", videoUrl: `${CDN}/efc7bcdc-2e0e-45a7-a195-7f253abb5763/play_480p.mp4` },
  { id: "v34", title: "FINAL COUNTDOWN",      category: "Action",   aspect: "landscape", thumbnail: "/landscape/34.png", videoUrl: `${CDN}/c0bc6251-f2c8-46b3-89c5-6eea3cd9ce15/play_480p.mp4` },
  { id: "v35", title: "THE DARK NETWORK",     category: "Crime",    aspect: "landscape", thumbnail: "/landscape/35.png", videoUrl: `${CDN}/e9657c34-99bf-4067-bb06-6c1fae913f0c/play_480p.mp4` },
  { id: "v36", title: "THE SECRET MISSION",   category: "Action",   aspect: "landscape", thumbnail: "/landscape/36.png", videoUrl: `${CDN}/4cb2c276-8ecd-49ef-967c-48ba4631aa1b/play_480p.mp4` },
  { id: "v37", title: "THE SECRET SYNDICATE", category: "Crime",    aspect: "landscape", thumbnail: "/landscape/37.png", videoUrl: `${CDN}/6cffca6b-7759-40e7-84de-c97856b4c7be/play_480p.mp4` },
  { id: "v38", title: "THE UNKNOWN TARGET",   category: "Thriller", aspect: "landscape", thumbnail: "/landscape/38.png", videoUrl: `${CDN}/cb6cdbd5-e1d3-470c-ab5c-a7e8bcb58945/play_480p.mp4` },
  { id: "v39", title: "WANTED FOR REVENGE",   category: "Action",   aspect: "landscape", thumbnail: "/landscape/39.png", videoUrl: `${CDN}/a1acd60e-f874-466e-a7aa-c76db9cb57df/play_480p.mp4` },
  { id: "v40", title: "LAST MISSION ALIVE",   category: "Thriller", aspect: "landscape", thumbnail: "/landscape/40.png", videoUrl: `${CDN}/a1d91030-cf54-420a-9b1c-4afe9ba19e15/play_480p.mp4` },
];

export const escapeSeriesVideos: Video[] = [
  { id: "v41", title: "MIDNIGHT ESCAPE",           category: "Thriller", aspect: "portrait", thumbnail: "/portrait/41.png", videoUrl: `${CDN}/9ac5b5f9-d682-44a7-b877-772dec4b380d/play_480p.mp4` },
  { id: "v42", title: "THE DIARY SECRETS",         category: "Mystery",  aspect: "portrait", thumbnail: "/portrait/42.png", videoUrl: `${CDN}/d1f6716d-b7b1-41c3-8e4a-fd7204a75a74/play_480p.mp4` },
  { id: "v43", title: "HER STORY",                 category: "Drama",    aspect: "portrait", thumbnail: "/portrait/43.png", videoUrl: `${CDN}/e8ad8fc4-49fa-43ab-9fda-36916e56d066/play_480p.mp4` },
  { id: "v44", title: "DANGEROUS TERRITORY",       category: "Action",   aspect: "portrait", thumbnail: "/portrait/44.png", videoUrl: `${CDN}/ee836cdd-1c34-4b4d-843c-3d2c4be8e879/play_480p.mp4` },
  { id: "v45", title: "SHADOW PROTOCOL",           category: "Thriller", aspect: "portrait", thumbnail: "/portrait/45.png", videoUrl: `${CDN}/08ebb0ad-11cd-458a-823b-3e19382347aa/play_480p.mp4` },
  { id: "v46", title: "ESCAPE BEYOND FEAR EP1",    category: "Thriller", aspect: "portrait", thumbnail: "/portrait/46.png", videoUrl: `${CDN}/7bd7696a-2b32-4542-ac63-73fe38a547fc/play_480p.mp4` },
  { id: "v47", title: "ESCAPE BEYOND FEAR EP2",    category: "Thriller", aspect: "portrait", thumbnail: "/portrait/47.png", videoUrl: `${CDN}/e2c089c7-9466-462d-93c7-a72a539672b6/play_480p.mp4` },
  { id: "v48", title: "ESCAPE BEYOND FEAR EP3",    category: "Thriller", aspect: "portrait", thumbnail: "/portrait/48.png", videoUrl: `${CDN}/06429499-6d65-49a3-98e6-84777884c4a2/play_480p.mp4` },
  { id: "v49", title: "UNDERGROUND WARRIORS EP1",  category: "Action",   aspect: "portrait", thumbnail: "/portrait/49.png", videoUrl: `${CDN}/f7369a9f-d2e8-4c89-9cf2-87cb013dd9d0/play_480p.mp4` },
  { id: "v50", title: "UNDERGROUND WARRIORS EP2",  category: "Action",   aspect: "portrait", thumbnail: "/portrait/50.png", videoUrl: `${CDN}/c91afc25-592f-4923-9ab4-62f18da47bc6/play_480p.mp4` },
];

export const mysteryFilesVideos: Video[] = [
  { id: "v51", title: "MYSTERY JUNCTION",      category: "Mystery",  aspect: "landscape", thumbnail: "/landscape/51.png", videoUrl: `${CDN}/d1150337-4151-4343-826d-7311f5dbe500/play_480p.mp4` },
  { id: "v52", title: "DARK CITY FILES",       category: "Crime",    aspect: "landscape", thumbnail: "/landscape/52.png", videoUrl: `${CDN}/64ef26c1-c28b-4cd4-926e-7f878f62e2c1/play_480p.mp4` },
  { id: "v53", title: "THE WANTED TARGET",     category: "Action",   aspect: "landscape", thumbnail: "/landscape/53.png", videoUrl: `${CDN}/b9704452-fd1f-431d-a921-a0fa8187a170/play_480p.mp4` },
  { id: "v54", title: "WANTED BY DARKNESS",    category: "Thriller", aspect: "landscape", thumbnail: "/landscape/54.png", videoUrl: `${CDN}/292e7874-e83e-4818-a9fe-7d7775b096c2/play_480p.mp4` },
  { id: "v55", title: "UNKNOWN ENEMY EP1",     category: "Thriller", aspect: "landscape", thumbnail: "/landscape/55.png", videoUrl: `${CDN}/0eacbf8f-3c0a-409b-8874-bb298c466933/play_480p.mp4` },
  { id: "v56", title: "UNKNOWN ENEMY EP2",     category: "Thriller", aspect: "landscape", thumbnail: "/landscape/56.png", videoUrl: `${CDN}/fc6a7905-ca95-44d9-a814-a101961bfb2b/play_480p.mp4` },
  { id: "v57", title: "UNKNOWN ENEMY EP3",     category: "Thriller", aspect: "landscape", thumbnail: "/landscape/57.png", videoUrl: `${CDN}/c4bcdd12-b1f3-4598-9ffc-b7072ac2d354/play_480p.mp4` },
  { id: "v58", title: "THE SHADOW GAME EP1",   category: "Mystery",  aspect: "landscape", thumbnail: "/landscape/58.png", videoUrl: `${CDN}/35634848-cd48-4d3d-bc4d-2b7f12a6bf5e/play_480p.mp4` },
  { id: "v59", title: "THE SHADOW GAME EP2",   category: "Mystery",  aspect: "landscape", thumbnail: "/landscape/59.png", videoUrl: `${CDN}/4fd32d2b-e1e1-43ab-84c7-a5fba6524f83/play_480p.mp4` },
  { id: "v60", title: "THE SHADOW GAME EP3",   category: "Mystery",  aspect: "landscape", thumbnail: "/landscape/60.png", videoUrl: `${CDN}/463534cc-d355-4fe9-b6da-53277140f4cd/play_480p.mp4` },
];

export const shadowGameVideos: Video[] = [
  { id: "v61", title: "THE SHADOW GAME EP4", category: "Mystery",   aspect: "portrait", thumbnail: "/portrait/61.png", videoUrl: `${CDN}/14b5d597-5c1b-4146-a77c-76f8621cbee6/play_480p.mp4` },
  { id: "v62", title: "THE FITNESS TRAP",    category: "Thriller", aspect: "portrait", thumbnail: "/portrait/62.png", videoUrl: `${CDN}/a74bbde6-2f05-49b7-88b5-68ad82b4186c/play_480p.mp4` },
  { id: "v63", title: "THE LAST DEAL",       category: "Crime",    aspect: "portrait", thumbnail: "/portrait/63.png", videoUrl: `${CDN}/2508404e-25a4-475c-8c05-af707dbf1e5d/play_480p.mp4` },
  { id: "v64", title: "THE CRIME CIRCLE",    category: "Crime",    aspect: "portrait", thumbnail: "/portrait/64.png", videoUrl: `${CDN}/912b01f0-6f55-491b-931d-7cda175785e2/play_480p.mp4` },
  { id: "v65", title: "SECRET NIGHTS",       category: "Drama",    aspect: "portrait", thumbnail: "/portrait/65.png", videoUrl: `${CDN}/0091603b-6880-49c6-ac89-efab0ec04bb8/play_480p.mp4` },
  { id: "v66", title: "MISSSION DARKNIGHT",  category: "Action",   aspect: "portrait", thumbnail: "/portrait/66.png", videoUrl: `${CDN}/bf3ebf7d-ca49-443f-b7b8-1a3d4e2ae96b/play_480p.mp4` },
  { id: "v67", title: "ADVENTURE KE RAAZ",   category: "Adventure", aspect: "portrait", thumbnail: "/portrait/67.png", videoUrl: `${CDN}/a76b2561-f104-4a00-b5ba-5943a1ee5620/play_480p.mp4` },
  { id: "v68", title: "KILLER INSTINCT",     category: "Thriller", aspect: "portrait", thumbnail: "/portrait/68.png", videoUrl: `${CDN}/b920eca1-3a4a-4fce-bebd-0a9d2633e4f3/play_480p.mp4` },
  { id: "v69", title: "ESCAPE ROUT 21",      category: "Action",   aspect: "portrait", thumbnail: "/portrait/69.png", videoUrl: `${CDN}/390332b1-be21-4c28-9bf5-06832673baad/play_480p.mp4` },
  { id: "v70", title: "BLACK SIGNAL",        category: "Thriller", aspect: "portrait", thumbnail: "/portrait/70.png", videoUrl: `${CDN}/f5c0b07d-5a7f-4df6-b906-1f7a2f0cef76/play_480p.mp4` },
];

export const rogueNationVideos: Video[] = [
  { id: "v71", title: "ROGUE NATION",      category: "Action",   aspect: "landscape", thumbnail: "/landscape/71.png",  videoUrl: `${CDN}/19507c09-9c6e-410c-b01c-ccd6d9423e12/play_480p.mp4` },
  { id: "v72", title: "SILENT WITNESS",    category: "Thriller", aspect: "landscape", thumbnail: "/landscape/72.png",  videoUrl: `${CDN}/a0f4772a-4376-44b1-a458-b50eff38a0e0/play_480p.mp4` },
  { id: "v73", title: "HIDDEN FEAR EP1",   category: "Thriller", aspect: "landscape", thumbnail: "/landscape/73.png",  videoUrl: `${CDN}/d72d661d-325f-4d19-b173-bf88746ddc7a/play_480p.mp4` },
  { id: "v74", title: "HIDDEN FEAR EP2",   category: "Thriller", aspect: "landscape", thumbnail: "/landscape/74.png",  videoUrl: `${CDN}/970a0093-5f14-4f29-bd36-c91b8565172a/play_480p.mp4` },
  { id: "v75", title: "HIDDEN FEAR EP3",   category: "Thriller", aspect: "landscape", thumbnail: "/landscape/75.png",  videoUrl: `${CDN}/ec06e7f9-7dc5-43f3-960e-7bef831ec46c/play_480p.mp4` },
  { id: "v76", title: "HIDDEN FEAR EP4",   category: "Thriller", aspect: "landscape", thumbnail: "/landscape/76.png",  videoUrl: `${CDN}/9ea2a343-b279-4455-928c-5cc71bc00297/play_480p.mp4` },
  { id: "v77", title: "THE SILENT HUNT",   category: "Mystery",  aspect: "landscape", thumbnail: "/landscape/77.png",  videoUrl: `${CDN}/4941972e-1692-4d0b-ab19-28887a806631/play_480p.mp4` },
  { id: "v78", title: "THE LAST CHANCE",   category: "Drama",    aspect: "landscape", thumbnail: "/landscape/78.png",  videoUrl: `${CDN}/20428f28-cc91-4463-bb07-df334be38ab3/play_480p.mp4` },
  { id: "v79", title: "SHADOW FORCE",      category: "Action",   aspect: "landscape", thumbnail: "/landscape/79.png",  videoUrl: `${CDN}/514d2131-df62-4be5-aef6-126d1595aee7/play_480p.mp4` },
  { id: "v80", title: "CRIMEWAVE",         category: "Crime",    aspect: "landscape", thumbnail: "/landscape/80.png",  videoUrl: `${CDN}/516d12a8-04e5-4779-87d2-fa2809493d70/play_480p.mp4` },
];

export const mysteryAvenueVideos: Video[] = [
  { id: "v81", title: "MYSTERY AVENUE",              category: "Mystery",  aspect: "portrait", thumbnail: "/portrait/81.png", videoUrl: `${CDN}/06572887-18a3-4cb0-bc48-59323e881c35/play_480p.mp4` },
  { id: "v82", title: "DANGEROUS DESTINATION EP1",   category: "Thriller", aspect: "portrait", thumbnail: "/portrait/82.png", videoUrl: `${CDN}/6e1962ba-dbcc-4c2b-963a-d3176124deb4/play_480p.mp4` },
  { id: "v83", title: "DANGEROUS DESTINATION EP2",   category: "Thriller", aspect: "portrait", thumbnail: "/portrait/83.png", videoUrl: `${CDN}/4527946b-8e26-4e53-87da-ab74f2313614/play_480p.mp4` },
  { id: "v84", title: "DANGEROUS DESTINATION EP3",   category: "Thriller", aspect: "portrait", thumbnail: "/portrait/84.png", videoUrl: `${CDN}/613259cb-60be-4296-96ca-63ebc21922c0/play_480p.mp4` },
  { id: "v85", title: "DANGEROUS DESTINATION EP4",   category: "Thriller", aspect: "portrait", thumbnail: "/portrait/85.png", videoUrl: `${CDN}/2c902c65-1f63-4855-be88-cee69e2ac9a0/play_480p.mp4` },
  { id: "v86", title: "KILLER WALI RAAT",            category: "Thriller", aspect: "portrait", thumbnail: "/portrait/86.png", videoUrl: `${CDN}/436a5e04-04b6-4bcc-bd2d-c54939083b0c/play_480p.mp4` },
  { id: "v87", title: "CODE RED MAFIA",              category: "Crime",    aspect: "portrait", thumbnail: "/portrait/87.png", videoUrl: `${CDN}/29215cc6-4174-406b-a21d-71122bc7336a/play_480p.mp4` },
  { id: "v88", title: "BLACKMAIL JUNCTION",          category: "Crime",    aspect: "portrait", thumbnail: "/portrait/88.png", videoUrl: `${CDN}/815e2654-4d69-4923-95e3-53c69ec72946/play_480p.mp4` },
  { id: "v89", title: "THE UNOFFICIAL NETWORK",      category: "Thriller", aspect: "portrait", thumbnail: "/portrait/89.png", videoUrl: `${CDN}/a90c6024-768c-4c24-87d4-07612b07477a/play_480p.mp4` },
  { id: "v90", title: "SHADOW OPERATION",            category: "Action",   aspect: "portrait", thumbnail: "/portrait/90.png", videoUrl: `${CDN}/7daed06f-23e0-41d5-a35c-9529616f0773/play_480p.mp4` },
];

export const chaseToDangerVideos: Video[] = [
  { id: "v91",  title: "CHASE TO DANGER EP1",        category: "Action",    aspect: "landscape", thumbnail: "/landscape/91.png",  videoUrl: `${CDN}/799c717b-cbcf-4050-8f14-2a9e199afadf/play_480p.mp4` },
  { id: "v92",  title: "CHASE TO DANGER EP2",        category: "Action",    aspect: "landscape", thumbnail: "/landscape/92.png",  videoUrl: `${CDN}/671096db-84aa-4452-8298-d564b5fe5a41/play_480p.mp4` },
  { id: "v93",  title: "CHASE TO DANGER EP3",        category: "Action",    aspect: "landscape", thumbnail: "/landscape/93.png",  videoUrl: `${CDN}/9d656763-670c-49e0-b721-ba6e9291b17b/play_480p.mp4` },
  { id: "v94",  title: "CHASE TO DANGER EP4",        category: "Action",    aspect: "landscape", thumbnail: "/landscape/94.png",  videoUrl: `${CDN}/af763878-2990-48bd-83f1-b396dbce21f7/play_480p.mp4` },
  { id: "v95",  title: "DARK EVEDENCE",              category: "Mystery",   aspect: "landscape", thumbnail: "/landscape/95.png",  videoUrl: `${CDN}/3b1ff614-219e-4e77-8a2f-ad32e744267e/play_480p.mp4` },
  { id: "v96",  title: "THE LAST TRUTH EP1",         category: "Drama",     aspect: "landscape", thumbnail: "/landscape/96.png",  videoUrl: `${CDN}/710a74b7-ec71-4504-abc9-d231aa23c2ec/play_480p.mp4` },
  { id: "v97",  title: "THE LAST TRUTH EP2",         category: "Drama",     aspect: "landscape", thumbnail: "/landscape/97.png",  videoUrl: `${CDN}/4851e395-3c41-44b6-a99a-06816305990e/play_480p.mp4` },
  { id: "v98",  title: "CRIME SYNDICATE",            category: "Crime",     aspect: "landscape", thumbnail: "/landscape/98.png",  videoUrl: `${CDN}/f5cbe468-f999-49b6-9bc0-1bd9c4451d5e/play_480p.mp4` },
  { id: "v99",  title: "BLACK HORIZON",              category: "Thriller",  aspect: "landscape", thumbnail: "/landscape/99.png",  videoUrl: `${CDN}/652f268b-717d-463c-9d72-75d109098df5/play_480p.mp4` },
  { id: "v100", title: "DARK EMPIRE",                category: "Crime",     aspect: "landscape", thumbnail: "/landscape/100.png", videoUrl: `${CDN}/2c8a4f59-3274-4347-ac68-5ff4d0789dae/play_480p.mp4` },
  { id: "v101", title: "ADVENTURE BEYOND BORDERS",   category: "Adventure", aspect: "landscape", thumbnail: "/landscape/101.png", videoUrl: `${CDN}/6dfc4323-4ae3-428e-9866-13053dbd731c/play_480p.mp4` },
  { id: "v102", title: "MIDNIGHT CASE",              category: "Mystery",   aspect: "landscape", thumbnail: "/landscape/102.png", videoUrl: `${CDN}/0ec9da21-5da0-42b1-a81a-2eb1ee0c98e5/play_480p.mp4` },
];

export const allVideos: Video[] = [
  ...trendingVideos,
  ...fatalConnectionsVideos,
  ...missionVideos,
  ...dangerousMindsVideos,
  ...escapeSeriesVideos,
  ...mysteryFilesVideos,
  ...shadowGameVideos,
  ...rogueNationVideos,
  ...mysteryAvenueVideos,
  ...chaseToDangerVideos,
];

export const homeSections = [
  { id: "trending",  title: "Crime & Mystery Originals", subtitle: "Thrilling investigations and dark secrets",              videos: trendingVideos,          layout: "grid2x5" },
  { id: "fatal",     title: "Latest Releases",           subtitle: "Fresh content you won't find anywhere else",            videos: fatalConnectionsVideos,  layout: "grid2x5" },
  { id: "mission",   title: "Action Packed Adventure",   subtitle: "High-octane missions and intense sequences",            videos: missionVideos,           layout: "grid2x5" },
  { id: "dangerous", title: "Trending Now",              subtitle: "What everyone is watching this week",                   videos: dangerousMindsVideos,    layout: "grid2x5" },
  { id: "escape",    title: "Dark & Intense",            subtitle: "Psychological thrillers and dark narratives",           videos: escapeSeriesVideos,      layout: "grid2x5" },
  { id: "mystery",   title: "Mystery Uncovered",         subtitle: "Secrets waiting to be revealed",                        videos: mysteryFilesVideos,      layout: "grid2x5" },
  { id: "shadow",    title: "Espionage & Secrets",       subtitle: "Undercover operations and classified missions",         videos: shadowGameVideos,        layout: "grid2x5" },
  { id: "rogue",     title: "Premium Selection",         subtitle: "Handpicked masterpieces for elite viewers",             videos: rogueNationVideos,       layout: "grid2x5" },
  { id: "avenue",    title: "Blockbuster Collections",   subtitle: "Epic stories with legendary performances",              videos: mysteryAvenueVideos,     layout: "grid2x5" },
  { id: "chase",     title: "Final Masterpieces",        subtitle: "The ultimate selection to complete your watchlist",     videos: chaseToDangerVideos,     layout: "grid2x6" },
];
