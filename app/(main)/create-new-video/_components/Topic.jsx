"use client"
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2Icon, SparklesIcon } from 'lucide-react'
import axios from 'axios'
import { useAuthContext } from '@/app/provider'
import { useLanguage } from '@/app/_context/LanguageContext'
import { getTranslation } from '@/lib/translations'
import { toast } from 'sonner'
const suggestionKeys = [
    "historicStory",
    "kidsStory",
    "movieStories",
    "aiInnovations",
    "spaceMysteries",
    "horrorStories",
    "mythologicalTales",
    "techBreakthroughs",
    "trueCrimeStories",
    "fantasyAdventures",
    "scienceExperiments",
    "motivationalStories",
    "futuristicVisions",]
function Topic({ onHandleInputChange }) {
    const [selectedTopic, setSelectedTopic] = useState();
    const [selectedScriptIndex, setSelectedScriptIndex] = useState();
    const [scripts, setScripts] = useState();
    const [loading, setLoading] = useState(false);
    const { user } = useAuthContext();
    const { language } = useLanguage();

    const GenerateScript = async () => {

        if (user?.credits <= 0) {
            toast(getTranslation('pleaseAddMoreCredits', language))
            return;
        }
        setLoading(true);
        setSelectedScriptIndex(null);
        console.log(selectedTopic)
        try {
            const result = await axios.post('/api/generate-script', {
                topic: selectedTopic
            });
            console.log(result.data);
            setScripts(result.data?.scripts);
        }
        catch (e) {
            console.log(e);
        }
        setLoading(false);
    }

    return (
        <div>
            <h2 className='mb-1 font-semibold'>{getTranslation('projectTitle', language)}</h2>
            <Input placeholder={getTranslation('enterProjectTitle', language)} onChange={(event) => {
                onHandleInputChange('title', event?.target.value);
            }} />
            <div className='mt-5'>
                <h2 className='font-semibold'>{getTranslation('videoTopic', language)}</h2>
                <p className='text-sm text-gray-400 '>{getTranslation('selectTopicForVideo', language)}</p>

                <Tabs defaultValue="suggestion" className="w-full mt-2">
                    <TabsList>
                        <TabsTrigger value="suggestion">{getTranslation('suggestions', language)}</TabsTrigger>
                        <TabsTrigger value="your_topic">{getTranslation('yourTopic', language)}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="suggestion">
                        <div className=''>
                            {suggestionKeys.map((suggestionKey, index) => {
                                const suggestion = getTranslation(suggestionKey, language);
                                return (
                                    <Button variant="outline" key={index}
                                        className={`m-1 ${suggestion == selectedTopic && 'bg-secondary'}`}
                                        onClick={() => {
                                            setSelectedTopic(suggestion)
                                            onHandleInputChange('topic', suggestion)
                                        }}>{suggestion}</Button>
                                )
                            })}
                        </div>
                    </TabsContent>
                    <TabsContent value="your_topic">
                        <div>
                            <h2>{getTranslation('enterYourOwnTopic', language)}</h2>
                            <Textarea placeholder={getTranslation('enterYourTopic', language)}
                                onChange={(event) => {
                                    onHandleInputChange('topic', event.target.value);
                                    setSelectedTopic(event.target.value)
                                }}
                            />
                        </div>
                    </TabsContent>
                </Tabs>

                {scripts?.length > 0 &&
                    <div className='mt-3'>
                        <h2>{getTranslation('selectTheScript', language)}</h2>
                        <div className='grid grid-cols-2 gap-5 mt-1'>
                            {scripts?.map((item, index) => (
                                <div key={index}
                                    className={`p-3 border rounded-lg cursor-pointer
                                ${selectedScriptIndex == index && 'border-white bg-secondary'}
                                `}
                                    onClick={() => {
                                        setSelectedScriptIndex(index);
                                        onHandleInputChange('script', item?.content)
                                    }}
                                >
                                    <h2 className='line-clamp-4 text-sm text-gray-300'>{item.content}</h2>
                                </div>
                            ))}
                        </div>
                    </div>
                }

            </div>
            {!scripts && <Button className="mt-3 font-semibold text-sm" size="sm"
                disabled={loading}
                onClick={GenerateScript}>
                {loading ? <Loader2Icon className='animate-spin' /> : <SparklesIcon />}{getTranslation('generateScript', language)} </Button>}
        </div>
    )
}

export default Topic