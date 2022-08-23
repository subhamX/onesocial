export const UserProfileSiteLogo = ({siteTitle, avatar_url}: {siteTitle: string, avatar_url: string}) => (
    <div className="">
        <div className="flex items-center gap-2">
            <div className="hidden xss:block avatar">
                <div className="h-8 rounded-full">
                    <img src={avatar_url} />
                </div>
            </div>
            <div className="flex flex-col">
                <div className="font-medium text-lg">{siteTitle}</div>
            </div>
        </div>
    </div>
);
