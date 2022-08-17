export const UserProfileSiteLogo = ({siteTitle}: {siteTitle: string}) => (
    <div className="">
        <div className="flex items-center gap-2">
            <div className="hidden xss:block avatar">
                <div className="h-8 rounded-full">
                    <img src="https://unsplash.com/photos/wQLAGv4_OYs/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8MjB8fHVzZXIlMjBwcm9maWxlJTIwYWJzdHJhY3R8ZW58MHx8fHwxNjYwNTkxNzY2&force=true&w=100" />
                </div>
            </div>
            <div className="flex flex-col">
                <div className="font-medium text-lg">{siteTitle}</div>
            </div>
        </div>
    </div>
);
